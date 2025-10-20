import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as FileSystem from 'react-native-fs';
import * as DocumentPicker from 'react-native-document-picker';
import { launch } from 'react-native-file-viewer';

// Типи для файлів
export interface FilePickerResult {
  uri: string;
  type: string;
  name: string;
  size: number;
  fileCopyUri?: string;
}

export interface FilePickerOptions {
  type?: string[];
  copyTo?: string;
  mode?: 'open' | 'import' | 'export';
  allowMultiSelection?: boolean;
}

export const useFile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestAndroidPermission = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Дозвіл на доступ до файлів',
          message: 'Додатку потрібен доступ до ваших файлів',
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

  const pickFile = useCallback(async (options: FilePickerOptions = {}): Promise<FilePickerResult> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          throw new Error('Немає дозволу на доступ до файлів');
        }
      }

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        ...options,
      });

      return result[0] as FilePickerResult;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        throw new Error('Вибір файлу скасовано');
      }
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestAndroidPermission]);

  const saveFile = useCallback(async (fileUrl: string, fileName: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          throw new Error('Немає дозволу на збереження файлів');
        }
      }

      const downloadPath = Platform.select({
        ios: `${FileSystem.DocumentDirectoryPath}/${fileName}`,
        android: `${FileSystem.DownloadDirectoryPath}/${fileName}`,
      }) as string;

      await FileSystem.copyFile(fileUrl, downloadPath);
      return downloadPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestAndroidPermission]);

  const openFile = useCallback(async (filePath: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await launch(filePath);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (filePath: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await FileSystem.unlink(filePath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    pickFile,
    saveFile,
    openFile,
    deleteFile,
  };
};

export default useFile;
