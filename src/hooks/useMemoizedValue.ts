import { useMemo, useRef, DependencyList } from 'react';

/**
 * Хук для мемоізації значення, який зберігає посилання на найновішу версію значення
 * @param value - Значення для мемоізації
 * @param deps - Масив залежностей
 * @returns Мемоізоване значення
 */
export const useMemoizedValue = <T>(value: T, deps: DependencyList = []): T => {
  const valueRef = useRef<T>(value);

  // Оновлюємо ref при зміні value
  valueRef.current = value;

  return useMemo(() => {
    return valueRef.current;
  }, deps);
};

export default useMemoizedValue;
