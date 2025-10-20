import { StyleProp, ViewStyle } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Тип дії для кнопки FAB
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
  onPress?: (navigation?: NativeStackNavigationProp<ParamListBase>) => void;
}

/**
 * Пропси для компонента NewFAB
 */
export interface NewFABProps {
  /** Масив дій, які відображаються при відкритті меню */
  actions?: FABAction[];
  /** Об'єкт навігації для переходу на інші екрани */
  navigation?: NativeStackNavigationProp<ParamListBase>;
  /** Стилі для контейнера кнопки */
  style?: StyleProp<ViewStyle>;
}

/**
 * Пропси для компонента ScreenWithFAB
 */
export interface ScreenWithFABProps {
  /** Вміст екрану */
  children: React.ReactNode;
  /** Масив дій для FAB */
  fabActions?: FABAction[];
  /** Об'єкт навігації для переходу на інші екрани */
  navigation?: NativeStackNavigationProp<ParamListBase>;
}
