/**
 * Типи для компонента підказки
 */
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Позиції компонента Tooltip
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Розміри компонента Tooltip
 */
export type TooltipSize = 'small' | 'medium' | 'large';

/**
 * Пропси для компонента Tooltip
 */
export interface TooltipProps {
  /**
   * Текст підказки
   */
  message: string;
  
  /**
   * Позиція підказки
   */
  position?: TooltipPosition;
  
  /**
   * Тривалість відображення підказки (мс)
   */
  duration?: number;
  
  /**
   * Функція, яка викликається при закритті підказки
   */
  onClose?: () => void;
  
  /**
   * Стилі компонента
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Розмір компонента
   */
  size?: TooltipSize;
}
