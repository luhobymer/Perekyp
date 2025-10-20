import React, { Suspense, lazy, ComponentType } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * @function lazyLoad
 * @description Функція для лінивого завантаження компонентів React. Використовує React.lazy та Suspense
 * для асинхронного завантаження компонентів, що покращує продуктивність додатку, особливо при
 * першому завантаженні. Компоненти завантажуються тільки коли вони потрібні.
 * 
 * @example
 * // Використання для лінивого завантаження компонента
 * const LazyComponent = lazyLoad(() => import('../components/HeavyComponent'));
 * 
 * // Використання з власним компонентом завантаження
 * const LazyComponent = lazyLoad(
 *   () => import('../components/HeavyComponent'),
 *   <CustomLoadingIndicator />
 * );
 * 
 * @template T - Тип компонента, який буде лінивого завантажено
 * @param {() => Promise<{ default: T }>} importFunc - Функція імпорту компонента
 * @param {React.ReactNode} [fallback] - Компонент, який буде показано під час завантаження
 * @returns {T} Компонент з лінивим завантаженням, який можна використовувати як звичайний компонент
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <DefaultLoadingComponent />
): T {
  const LazyComponent = lazy(importFunc);

  const LazyLoadComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return LazyLoadComponent as unknown as T;
}

/**
 * @component DefaultLoadingComponent
 * @description Компонент за замовчуванням для відображення під час лінивого завантаження.
 * Показує індикатор завантаження по центру екрану з кольором, визначеним у темі.
 * 
 * @example
 * <DefaultLoadingComponent />
 * 
 * @returns {JSX.Element} Компонент з індикатором завантаження
 */
export const DefaultLoadingComponent: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default lazyLoad;
