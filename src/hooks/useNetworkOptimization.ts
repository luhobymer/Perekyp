import { useCallback, useRef } from 'react';

/**
 * Хук для дебаунсу функції
 * @param callback - Функція для дебаунсу
 * @param delay - Затримка в мілісекундах
 * @returns Функція з дебаунсом
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T, 
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

/**
 * Хук для тротлінгу функції
 * @param callback - Функція для тротлінгу
 * @param delay - Затримка в мілісекундах
 * @returns Функція з тротлінгом
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T, 
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      callback(...args);
      lastCall.current = now;
    }
  }, [callback, delay]);
};

/**
 * Хук для кешування результатів функції
 * @param callback - Функція, результати якої будуть кешуватися
 * @param keyGenerator - Функція для генерації ключа кешу
 * @returns Функція з кешуванням результатів
 */
export const useCache = <T extends (...args: any[]) => Promise<any>, K = string>(
  callback: T, 
  keyGenerator?: (...args: Parameters<T>) => K
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  const cache = useRef<Map<K | string, ReturnType<T>>>(new Map());

  return useCallback(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args) as K | string;

    if (cache.current.has(key)) {
      return cache.current.get(key) as ReturnType<T>;
    }

    const result = await callback(...args);
    cache.current.set(key, result);

    return result;
  }, [callback, keyGenerator]);
};

export default {
  useDebounce,
  useThrottle,
  useCache,
};
