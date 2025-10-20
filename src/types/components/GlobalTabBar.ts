import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface TabItem {
  /**
   * Унікальний ідентифікатор вкладки
   */
  name: string;
  
  /**
   * Відображувана назва вкладки
   */
  label: string;
  
  /**
   * Назва іконки з бібліотеки Ionicons
   */
  icon: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  
  /**
   * Шлях для навігації
   */
  path: string;
  
  /**
   * Чи показувати бейдж з кількістю
   */
  badgeCount?: number;
}

export interface GlobalTabBarProps {
  /**
   * Масив об'єктів з даними вкладок
   */
  tabs?: TabItem[];
  
  /**
   * Стилі для контейнера компонента
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Стилі для активної вкладки
   */
  activeTabStyle?: StyleProp<ViewStyle>;
  
  /**
   * Стилі для неактивної вкладки
   */
  inactiveTabStyle?: StyleProp<ViewStyle>;
  
  /**
   * Стилі для тексту активної вкладки
   */
  activeTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Стилі для тексту неактивної вкладки
   */
  inactiveTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Колір іконки активної вкладки
   */
  activeTintColor?: string;
  
  /**
   * Колір іконки неактивної вкладки
   */
  inactiveTintColor?: string;
  
  /**
   * Обробник натискання на вкладку
   * @param path - Шлях вкладки
   */
  onTabPress?: (path: string) => void;
  
  /**
   * Чи показувати підсвічування активної вкладки
   * @default true
   */
  showActiveIndicator?: boolean;
  
  /**
   * Стиль для індикатора активної вкладки
   */
  indicatorStyle?: StyleProp<ViewStyle>;
}
