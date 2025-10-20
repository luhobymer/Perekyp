import { StyleProp, ViewStyle } from 'react-native';

/**
 * Тип дії для кнопки FloatingActionButton
 */
export interface FABAction {
  /** Заголовок дії */
  title: string;
  /** Назва іконки (Ionicons) */
  icon: string;
  /** Колір фону кнопки дії */
  color?: string;
  /** Колір фону іконки */
  iconBg?: string;
  /** Колір іконки */
  iconColor?: string;
  /** Функція, яка викликається при натисканні на дію */
  onPress?: () => void;
}

/**
 * Пропси для компонента FloatingActionButton
 */
export interface FloatingActionButtonProps {
  /** Масив дій, які відображаються при відкритті меню */
  actions?: FABAction[];
  /** Стилі для контейнера кнопки */
  style?: StyleProp<ViewStyle>;
}
