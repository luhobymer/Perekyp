import { useState, useCallback } from 'react';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

interface MediaOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  quality?: number;
  [key: string]: any;
}

interface UseMediaResult {
  loading: boolean;
  error: string | null;
  takePhoto: (options?: MediaOptions) => Promise<Asset | null>;
  pickImage: (options?: MediaOptions) => Promise<Asset | null>;
}

export const useMedia = (): UseMediaResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Дозвіл на використання камери',
            message: 'Додатку потрібен доступ до камери для фотографування',
            buttonNeutral: 'Запитати пізніше',
            buttonNegative: 'Скасувати',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Помилка запиту дозволу камери:', err);
        return false;
      }
    }
    return true;
  };

  const takePhoto = useCallback(async (options: MediaOptions = {}): Promise<Asset | null> => {
    setLoading(true);
    setError(null);

    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Немає дозволу на використання камери');
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        ...options,
      });

      if (result.didCancel) {
        throw new Error('Користувач скасував зйомку');
      }

      if (result.errorCode) {
        throw new Error(result.errorMessage || 'Невідома помилка камери');
      }

      return result.assets?.[0] || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка при зйомці фото:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const pickImage = useCallback(async (options: MediaOptions = {}): Promise<Asset | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        ...options,
      });

      if (result.didCancel) {
        throw new Error('Користувач скасував вибір');
      }

      if (result.errorCode) {
        throw new Error(result.errorMessage || 'Невідома помилка вибору зображення');
      }

      return result.assets?.[0] || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка при виборі фото:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    takePhoto,
    pickImage,
  };
};

export default useMedia;
