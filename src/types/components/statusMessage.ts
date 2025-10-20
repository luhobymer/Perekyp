/**
 * Типи для компонента повідомлення про статус
 */
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Типи повідомлень про статус
 */
export type StatusMessageType = 'success' | 'error' | 'warning' | 'info';

/**
 * Розміри компонента StatusMessage
 */
export type StatusMessageSize = 'small' | 'medium' | 'large';

/**
 * Пропси для компонента StatusMessage
 */
export interface StatusMessageProps {
  /**
   * Тип повідомлення
   */
  type?: StatusMessageType;
  
  /**
   * Текст повідомлення
   */
  message: string;
  
  /**
   * Тривалість відображення повідомлення (мс)
   */
  duration?: number;
  
  /**
   * Функція, яка викликається при закритті повідомлення
   */
  onClose?: () => void;
  
  /**
   * Стилі компонента
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Розмір компонента
   */
  size?: StatusMessageSize;
}
