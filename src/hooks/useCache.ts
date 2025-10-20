import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Типи для кешу
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  ttl?: number;
  onError?: (error: Error) => void;
}

export const useCache = <T>(key: string, initialData: T | null = null, options: CacheOptions = {}) => {
  const {
    ttl = 3600000, // 1 година за замовчуванням
    onError = console.error,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const saveToCache = useCallback(async (newData: T): Promise<void> => {
    try {
      const cacheItem: CacheItem<T> = {
        data: newData,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
      setData(newData);
      setError(null);
    } catch (err) {
      const cacheError = err instanceof Error ? err : new Error('Невідома помилка кешування');
      setError(cacheError);
      onError(cacheError);
    }
  }, [key, onError]);

  const loadFromCache = useCallback(async (): Promise<T | null> => {
    try {
      setIsLoading(true);
      const cached = await AsyncStorage.getItem(key);
      
      if (cached) {
        const parsedCache = JSON.parse(cached) as CacheItem<T>;
        const { data: cachedData, timestamp } = parsedCache;
        const isExpired = Date.now() - timestamp > ttl;
        
        if (!isExpired) {
          setData(cachedData);
          setError(null);
          return cachedData;
        }
      }
      
      return null;
    } catch (err) {
      const cacheError = err instanceof Error ? err : new Error('Невідома помилка читання кешу');
      setError(cacheError);
      onError(cacheError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [key, ttl, onError]);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      setData(initialData);
      setError(null);
    } catch (err) {
      const cacheError = err instanceof Error ? err : new Error('Невідома помилка очищення кешу');
      setError(cacheError);
      onError(cacheError);
    }
  }, [key, initialData, onError]);

  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  return {
    data,
    isLoading,
    error,
    saveToCache,
    loadFromCache,
    clearCache,
  };
};

export default useCache;
