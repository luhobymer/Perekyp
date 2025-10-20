import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export interface AnimatedScreenProps {
  /**
   * Вміст екрану, який буде анімовано
   */
  children: ReactNode;
  
  /**
   * Додаткові стилі для контейнера екрану
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Тривалість анімації появи (у мілісекундах)
   * @default 300
   */
  duration?: number;
  
  /**
   * Затримка перед початком анімації (у мілісекундах)
   * @default 0
   */
  delay?: number;
  
  /**
   * Чи використовувати анімацію зсуву
   * @default true
   */
  animateSlide?: boolean;
  
  /**
   * Чи використовувати анімацію прозорості
   * @default true
   */
  animateOpacity?: boolean;
  
  /**
   * Напрямок зсуву (від якого краю екрану з'являється контент)
   * @default 'right'
   */
  slideFrom?: 'left' | 'right' | 'top' | 'bottom';
  
  /**
   * Обробник події завершення анімації
   */
  onAnimationEnd?: () => void;
  
  /**
   * Обробник події початку анімації
   */
  onAnimationStart?: () => void;
}
