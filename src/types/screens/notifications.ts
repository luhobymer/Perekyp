/**
 * Типи для екрану сповіщень
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/mainNavigator';

/**
 * Типи сповіщень
 */
export type NotificationType = 'expense' | 'service' | 'document' | 'mileage' | 'status';

/**
 * Інтерфейс для сповіщення
 */
export interface Notification {
  id: string;
  user_id: string;
  car_id?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

/**
 * Пропси для екрану сповіщень
 */
export interface NotificationsScreenProps {
  navigation: NativeStackNavigationProp<MainStackParamList>;
}

/**
 * Пропси для компонента списку сповіщень
 */
export interface NotificationsListProps {
  notifications: Notification[];
  onRefresh: () => Promise<void>;
  refreshing: boolean;
  onNotificationPress: (notification: Notification) => void;
}
