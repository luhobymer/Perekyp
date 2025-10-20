import { StyleProp, ViewStyle } from 'react-native';

/**
 * Дані профілю користувача
 */
export interface UserProfile {
  /** Унікальний ідентифікатор користувача */
  id: string;
  /** Повне ім'я користувача */
  full_name?: string;
  /** Email користувача */
  email: string;
  /** Номер телефону користувача */
  phone?: string;
  /** Адреса користувача */
  address?: string;
  /** Дата створення профілю */
  created_at?: string;
  /** Дата останнього оновлення профілю */
  updated_at?: string;
  /** URL аватара користувача */
  avatar_url?: string;
}

/**
 * Дані форми редагування профілю
 */
export interface ProfileFormData {
  /** Повне ім'я користувача */
  full_name: string;
  /** Номер телефону користувача */
  phone: string;
  /** Адреса користувача */
  address: string;
}

/**
 * Пропси для компонента ProfileScreen
 */
export interface ProfileScreenProps {
  /** Стилі для контейнера */
  containerStyle?: StyleProp<ViewStyle>;
}
