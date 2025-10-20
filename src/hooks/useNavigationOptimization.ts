import { useEffect, useRef, DependencyList } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Хук для оптимізації навігації, який виконує callback після завершення анімації навігації
 * @param callback - Функція, яка буде викликана після завершення анімації
 * @param deps - Масив залежностей
 */
export const useNavigationOptimization = (
  callback: () => void, 
  deps: DependencyList = []
): void => {
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    mounted.current = true;

    // Виконуємо callback після завершення анімації навігації
    InteractionManager.runAfterInteractions(() => {
      if (mounted.current) {
        callback();
      }
    });

    return () => {
      mounted.current = false;
    };
  }, deps);
};

export default useNavigationOptimization;
