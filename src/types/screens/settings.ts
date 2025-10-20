import { StyleProp, ViewStyle } from 'react-native';

/**
 * Підтримувані мови додатку
 */
export type AppLanguage = 'uk' | 'ru';

/**
 * Пропси для компонента SettingsScreen
 */
export interface SettingsScreenProps {
  /**
   * Стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
}
