/**
 * Типи для компонента тексту
 */
import { TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';

/**
 * Варіанти тексту
 */
export type TextVariant = 'header' | 'title' | 'subtitle' | 'body' | 'caption';

/**
 * Пропси для компонента тексту
 */
export interface TextProps extends RNTextProps {
  /**
   * Стилі компонента
   */
  style?: StyleProp<TextStyle>;
  
  /**
   * Варіант тексту
   */
  variant?: TextVariant;
  
  /**
   * Колір тексту
   */
  color?: string;
  
  /**
   * Чи використовувати моноширинний шрифт
   */
  mono?: boolean;
  
  /**
   * Вміст компонента
   */
  children: React.ReactNode;
}
