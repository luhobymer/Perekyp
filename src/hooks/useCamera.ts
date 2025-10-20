import { useState, useCallback, useEffect } from 'react';
import { Camera, CameraDevice, PhotoFile, CameraPermissionStatus } from 'react-native-vision-camera';
import { Platform, PermissionsAndroid } from 'react-native';

// Типи для камери
export interface CameraOptions {
  quality?: 'low' | 'medium' | 'high';
  flash?: 'off' | 'on' | 'auto';
}

export interface CameraHook {
  hasPermission: boolean;
  loading: boolean;
  error: string | null;
  devices: CameraDevice[];
  selectedDevice: CameraDevice | null;
  setSelectedDevice: (device: CameraDevice) => void;
  checkPermission: () => Promise<boolean>;
  getDevices: () => Promise<CameraDevice[]>;
  takePhoto: (camera: Camera) => Promise<PhotoFile>;
}

export const useCamera = (options: CameraOptions = {}): CameraHook => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<CameraDevice | null>(null);

  const defaultOptions: Required<CameraOptions> = {
    quality: 'high',
    flash: 'off',
    ...options,
  };

  const requestAndroidPermission = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Дозвіл на використання камери',
          message: 'Додатку потрібен доступ до камери',
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

  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        setHasPermission(hasPermission);
        return hasPermission;
      }

      const permission = await Camera.requestCameraPermission();
      const isGranted = permission === 'granted';
      setHasPermission(isGranted);
      return isGranted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [requestAndroidPermission]);

  const getDevices = useCallback(async (): Promise<CameraDevice[]> => {
    try {
      setLoading(true);
      setError(null);

      const availableDevices = await Camera.getAvailableCameraDevices();
      setDevices(availableDevices);

      if (availableDevices.length > 0) {
        setSelectedDevice(availableDevices[0]);
      }

      return availableDevices;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const takePhoto = useCallback(async (camera: Camera): Promise<PhotoFile> => {
    if (!camera) {
      throw new Error('Камера не ініціалізована');
    }

    try {
      setLoading(true);
      setError(null);

      const photo = await camera.takePhoto({
        qualityPrioritization: defaultOptions.quality,
        flash: defaultOptions.flash,
      });

      return photo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [defaultOptions]);

  useEffect(() => {
    checkPermission();
    getDevices();
  }, [checkPermission, getDevices]);

  return {
    hasPermission,
    loading,
    error,
    devices,
    selectedDevice,
    setSelectedDevice,
    checkPermission,
    getDevices,
    takePhoto,
  };
};

export default useCamera;
