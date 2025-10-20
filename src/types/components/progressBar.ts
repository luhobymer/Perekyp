/**
 * Типи для компонента індикатора прогресу
 */
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Розміри компонента ProgressBar
 */
export type ProgressBarSize = 'small' | 'medium' | 'large';

/**
 * Пропси для компонента ProgressBar
 */
export interface ProgressBarProps {
  /**
   * Прогрес (від 0 до 1)
   */
  progress?: number;
  
  /**
   * Висота індикатора
   */
  height?: number;
  
  /**
   * Тривалість анімації (мс)
   */
  duration?: number;
  
  /**
   * Стилі компонента
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Розмір компонента
   */
  size?: ProgressBarSize;
}
