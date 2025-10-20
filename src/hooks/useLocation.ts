import { useState, useEffect, useCallback } from 'react';
import Geolocation, { GeoPosition, GeoError, GeoOptions } from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

// Типи для геолокації
export interface LocationHookOptions extends GeoOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface LocationHook {
  location: GeoPosition | null;
  loading: boolean;
  error: string | null;
  watching: boolean;
  getCurrentLocation: () => Promise<GeoPosition>;
  startWatching: () => void;
  stopWatching: () => void;
}

export const useLocation = (options: LocationHookOptions = {}): LocationHook => {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState<boolean>(false);

  const defaultOptions: LocationHookOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    ...options,
  };

  const requestAndroidPermission = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Дозвіл на використання геолокації',
          message: 'Додатку потрібен доступ до вашої геолокації',
          buttonNeutral: 'Запитати пізніше',
          buttonNegative: 'Скасувати',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Помилка запиту дозволу:', err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<GeoPosition> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          throw new Error('Дозвіл на використання геолокації не надано');
        }
      }

      return new Promise<GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: GeoPosition) => {
            setLocation(position);
            resolve(position);
          },
          (error: GeoError) => {
            setError(error.message);
            reject(error);
          },
          defaultOptions,
        );
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [defaultOptions, requestAndroidPermission]);

  const startWatching = useCallback((): void => {
    if (watching) return;

    try {
      setWatching(true);
      setError(null);

      Geolocation.watchPosition(
        (position: GeoPosition) => {
          setLocation(position);
        },
        (error: GeoError) => {
          setError(error.message);
          setWatching(false);
        },
        defaultOptions,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      setWatching(false);
    }
  }, [watching, defaultOptions]);

  const stopWatching = useCallback((): void => {
    if (!watching) return;
    Geolocation.stopObserving();
    setWatching(false);
  }, [watching]);

  useEffect(() => {
    return () => {
      if (watching) {
        stopWatching();
      }
    };
  }, [watching, stopWatching]);

  return {
    location,
    loading,
    error,
    watching,
    getCurrentLocation,
    startWatching,
    stopWatching,
  };
};

export default useLocation;
