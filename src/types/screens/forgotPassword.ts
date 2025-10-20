import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleProp, ViewStyle } from 'react-native';
import { AuthStackParamList } from '../navigation';

/**
 * Пропси для екрану відновлення паролю
 */
export interface ForgotPasswordScreenProps {
  /**
   * Об'єкт навігації для переходу між екранами
   */
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
  
  /**
   * Додаткові стилі для контейнера
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Дані форми відновлення паролю
 */
export interface ForgotPasswordFormData {
  /**
   * Електронна пошта користувача
   */
  email: string;
}

/**
 * Стан відправки запиту на відновлення паролю
 */
export enum PasswordResetStatus {
  /**
   * Початковий стан
   */
  IDLE = 'idle',
  
  /**
   * Відправка запиту
   */
  SUBMITTING = 'submitting',
  
  /**
   * Запит успішно відправлено
   */
  SUCCESS = 'success',
  
  /**
   * Помилка при відправці запиту
   */
  ERROR = 'error'
}
