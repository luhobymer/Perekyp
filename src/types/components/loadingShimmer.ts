/**
 * Типи для компонента LoadingShimmer
 */
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Розміри компонента LoadingShimmer
 */
export type LoadingShimmerSize = 'small' | 'medium' | 'large';

/**
 * Пропси для компонента LoadingShimmer
 */
export interface LoadingShimmerProps {
  /**
   * Ширина компонента
   */
  width?: number | string;
  
  /**
   * Висота компонента
   */
  height?: number | string;
  
  /**
   * Радіус заокруглення кутів
   */
  borderRadius?: number;
  
  /**
   * Стилі компонента
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Розмір компонента
   */
  size?: LoadingShimmerSize;
}
