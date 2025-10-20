import { useCallback, useRef, DependencyList } from 'react';

/**
 * Хук для мемоізації функції зворотного виклику, який зберігає посилання на найновішу версію функції
 * @param callback - Функція зворотного виклику
 * @param deps - Масив залежностей
 * @returns Мемоізована функція зворотного виклику
 */
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T, 
  deps: DependencyList = []
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const callbackRef = useRef<T>(callback);

  // Оновлюємо ref при зміні callback
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return callbackRef.current(...args);
  }, deps);
};

export default useMemoizedCallback;
