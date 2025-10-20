import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = <T>(key: string, initialValue: T | null = null) => {
  const [value, setValue] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadValue = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue) as T);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка завантаження даних:', err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const saveValue = useCallback(async (newValue: T): Promise<void> => {
    try {
      setLoading(true);
      const jsonValue = JSON.stringify(newValue);
      await AsyncStorage.setItem(key, jsonValue);
      setValue(newValue);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка збереження даних:', err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const removeValue = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(key);
      setValue(initialValue);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка видалення даних:', err);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await AsyncStorage.clear();
      setValue(initialValue);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка очищення сховища:', err);
    } finally {
      setLoading(false);
    }
  }, [initialValue]);

  return {
    value,
    loading,
    error,
    loadValue,
    saveValue,
    removeValue,
    clearAll,
  };
};

export default useStorage;
