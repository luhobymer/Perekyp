import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface LoadingIndicatorProps {
  /**
   * Текст повідомлення, яке відображається під індикатором завантаження.
   * Якщо не вказано, відображається текст за замовчуванням.
   */
  message?: string;
  
  /**
   * Додаткові стилі для контейнера індикатора
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту повідомлення
   */
  textStyle?: StyleProp<TextStyle>;
  
  /**
   * Розмір індикатора завантаження
   * @default 'large'
   */
  size?: 'small' | 'large' | number;
  
  /**
   * Чи показувати текст повідомлення
   * @default true
   */
  showMessage?: boolean;
  
  /**
   * Колір індикатора завантаження
   * Якщо не вказано, використовується основний колір теми
   */
  color?: string;
  
  /**
   * Додаткові пропси для компонента ActivityIndicator
   */
  indicatorProps?: object;
  
  /**
   * Додаткові пропси для компонента Text
   */
  textProps?: object;
}
