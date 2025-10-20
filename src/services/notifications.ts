import * as ExpoNotifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '../types';

// Тип для налаштувань сповіщень
interface NotificationSettings {
  user_id: string;
  enable_push: boolean;
  enable_email: boolean;
  enable_in_app: boolean;
  mute_all: boolean;
  car_updates?: boolean;
  expense_reminders?: boolean;
  document_expiry?: boolean;
  system_updates?: boolean;
}

// Тип для токену сповіщень
interface PushToken {
  user_id: string;
  push_token: string;
  device_type: string;
  created_at?: string;
  updated_at?: string;
}

// Тип для створення нового сповіщення
interface NotificationCreate {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  is_read?: boolean;
  related_id?: string;
  related_type?: string;
}

// Налаштування сповіщень
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const PUSH_TOKEN_KEY = '@push_token';

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      await savePushToken(token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Помилка отримання дозволу на сповіщення:', error);
    return null;
  }
};

export const savePushToken = async (token: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    const { error } = await supabase
      .from('user_push_tokens')
      .upsert({
        user_id: user.id,
        push_token: token,
        device_type: Platform.OS,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Помилка збереження токену:', error);
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const { data, error } = await supabase
      .from('user_notification_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка при отриманні налаштувань сповіщень:', errorMessage);
    throw error;
  }
};

export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Користувача не знайдено');

    const { data, error } = await supabase
      .from('user_notification_settings')
      .upsert({
        user_id: user.id,
        ...settings,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка оновлення налаштувань сповіщень:', errorMessage);
    throw error;
  }
};

export const setupNotificationListeners = (): void => {
  messaging().onMessage(async remoteMessage => {
    // Обробка сповіщень, коли додаток відкритий
    console.log('Отримано сповіщення:', remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Обробка сповіщень у фоні
    console.log('Отримано фонове сповіщення:', remoteMessage);
  });
};

export const removePushToken = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (!token) return;

    const { error } = await supabase
      .from('user_push_tokens')
      .delete()
      .eq('user_id', user.id)
      .eq('push_token', token);

    if (error) throw error;
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error('Помилка видалення токену:', error);
  }
};

// Реєстрація для Push-сповіщень
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Не вдалося отримати дозвіл на push-сповіщення!');
      return;
    }

    try {
      const tokenData = await ExpoNotifications.getExpoPushTokenAsync();
      token = tokenData.data;
    } catch (e) {
      console.error('Помилка отримання токену Expo:', e);
    }
  } else {
    console.log('Для сповіщень потрібен фізичний пристрій');
  }

  return token;
}

interface PushMessage {
  to: string;
  sound: 'default';
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Відправка сповіщення
export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  const message: PushMessage = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Помилка відправки сповіщення:', error);
  }
}

interface Partner {
  user_id: string;
  user_push_tokens: {
    push_token: string;
  } | null;
}

// Відправка сповіщення всім партнерам
export async function sendNotificationToPartners(
  carId: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    // Отримуємо всіх партнерів, які мають доступ до цього авто
    const { data: partners, error } = await supabase
      .from('car_partners')
      .select('user_id, user_push_tokens(push_token)')
      .eq('car_id', carId);
      
    if (error) {
      console.error('Помилка отримання партнерів:', error);
      return;
    }
    
    // Відправляємо сповіщення кожному партнеру
    for (const partner of partners as Partner[]) {
      if (partner.user_push_tokens && partner.user_push_tokens.push_token) {
        await sendPushNotification(
          partner.user_push_tokens.push_token,
          title,
          body,
          { ...data, carId }
        );
      }
    }
  } catch (error) {
    console.error('Помилка відправки сповіщень партнерам:', error);
  }
}

export const initializeNotifications = async (): Promise<string | null> => {
  try {
    // Перевірка дозволів на сповіщення
    const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      throw new Error('Дозвіл на сповіщення не надано');
    }

    // Отримання push-токена
    const tokenResponse = await ExpoNotifications.getExpoPushTokenAsync();
    const token = tokenResponse.data;
    
    // Отримання даних користувача
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Користувача не знайдено');
    
    // Збереження токена в базі даних
    const { error } = await supabase
      .from('user_push_tokens')
      .upsert({
        user_id: user.id,
        push_token: token,
        device_type: Platform.OS,
      });

    if (error) throw error;

    // Налаштування обробника сповіщень
    ExpoNotifications.addNotificationReceivedListener(notification => {
      console.log('Отримано сповіщення:', notification);
    });

    return token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка ініціалізації сповіщень:', errorMessage);
    throw error;
  }
};

export const createNotification = async (notification: NotificationCreate): Promise<Notification> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Користувача не знайдено');
    
    const { data, error } = await supabase
      .from('notification_history')
      .insert({
        user_id: user.id,
        ...notification,
        is_read: notification.is_read || false,
        type: notification.type || 'info',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка створення сповіщення:', errorMessage);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const { data, error } = await supabase
      .from('notification_history')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка позначення сповіщення як прочитане:', errorMessage);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notification_history')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка видалення сповіщення:', errorMessage);
    throw error;
  }
};
