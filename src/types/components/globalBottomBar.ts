import { StyleProp, ViewStyle } from 'react-native';

/**
 * Тип для елемента нижньої навігації
 */
export interface BottomTab {
  /** Унікальна назва вкладки */
  name: string;
  /** Текстова мітка вкладки */
  label: string;
  /** Базова назва іконки */
  icon: string;
  /** Назва іконки для активного стану */
  iconActive: string;
  /** Назва іконки для неактивного стану */
  iconInactive: string;
}

/**
 * Пропси для компонента GlobalBottomBar
 */
export interface GlobalBottomBarProps {
  /** Додаткові стилі для контейнера */
  containerStyle?: StyleProp<ViewStyle>;
  /** Колір активної вкладки */
  activeColor?: string;
  /** Колір неактивної вкладки */
  inactiveColor?: string;
}
