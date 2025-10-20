/**
 * Типи для компонента оптимізованого списку
 */
import { ReactElement } from 'react';
import { ViewStyle, StyleProp, ListRenderItem } from 'react-native';

/**
 * Розміри компонента OptimizedList
 */
export type OptimizedListSize = 'small' | 'medium' | 'large';

/**
 * Пропси для компонента OptimizedList
 */
export interface OptimizedListProps<T> {
  /**
   * Дані для відображення у списку
   */
  data: T[];
  
  /**
   * Функція для рендерингу елемента списку
   */
  renderItem: ListRenderItem<T>;
  
  /**
   * Функція для отримання ключа елемента списку
   */
  keyExtractor: (item: T, index: number) => string;
  
  /**
   * Функція, яка викликається при оновленні списку
   */
  onRefresh?: () => Promise<void> | void;
  
  /**
   * Функція, яка викликається при досягненні кінця списку
   */
  onEndReached?: () => void;
  
  /**
   * Поріг досягнення кінця списку
   */
  onEndReachedThreshold?: number;
  
  /**
   * Чи відбувається оновлення списку
   */
  refreshing?: boolean;
  
  /**
   * Чи відбувається завантаження даних
   */
  loading?: boolean;
  
  /**
   * Компонент, який відображається, коли список порожній
   */
  ListEmptyComponent?: ReactElement | (() => ReactElement);
  
  /**
   * Компонент, який відображається перед списком
   */
  ListHeaderComponent?: ReactElement | (() => ReactElement);
  
  /**
   * Компонент, який відображається після списку
   */
  ListFooterComponent?: ReactElement | (() => ReactElement);
  
  /**
   * Стилі для контейнера вмісту списку
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Стилі для контейнера списку
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Кількість колонок у списку
   */
  numColumns?: number;
  
  /**
   * Початкова кількість елементів для рендерингу
   */
  initialNumToRender?: number;
  
  /**
   * Максимальна кількість елементів для рендерингу за один раз
   */
  maxToRenderPerBatch?: number;
  
  /**
   * Розмір вікна для рендерингу
   */
  windowSize?: number;
  
  /**
   * Чи видаляти елементи, які не відображаються на екрані
   */
  removeClippedSubviews?: boolean;
  
  /**
   * Функція для отримання розмірів елемента списку
   */
  getItemLayout?: (data: T[] | null | undefined, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
  
  /**
   * Розмір компонента
   */
  size?: OptimizedListSize;
}
