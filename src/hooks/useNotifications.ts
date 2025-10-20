import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

interface UseNotificationsResult {
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  unreadCount: number;
  requestPermissions: () => Promise<boolean>;
  scheduleLocalNotification: (title: string, body: string, data?: Record<string, any>) => Promise<string>;
  getNotifications: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const useNotifications = (): UseNotificationsResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Запит дозволів на сповіщення
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (err) {
      console.error('Помилка запиту дозволів на сповіщення:', err);
      return false;
    }
  };

  // Планування локального сповіщення
  const scheduleLocalNotification = async (
    title: string,
    body: string,
    data: Record<string, any> = {}
  ): Promise<string> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Дозвіл на сповіщення не надано');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Відправка негайно
      });

      return notificationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      console.error('Помилка планування сповіщення:', errorMessage);
      throw err;
    }
  };

  // Отримання сповіщень з бази даних
  const getNotifications = async (): Promise<Notification[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      setUnreadCount(data?.filter((n: Notification) => !n.read).length || 0);

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка отримання сповіщень:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Позначення сповіщення як прочитаного
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (updateError) throw updateError;

      // Оновлюємо стан сповіщень
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка оновлення сповіщення:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Видалення сповіщення
  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (deleteError) throw deleteError;

      // Оновлюємо стан сповіщень
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка видалення сповіщення:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Підписка на зміни в реальному часі
  useEffect(() => {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: '*',
          schema: 'public',
          table: 'notifications'
        }, 
        (payload) => {
          // Оновлюємо стан при змінах у сповіщеннях
          getNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    loading,
    error,
    notifications,
    unreadCount,
    requestPermissions,
    scheduleLocalNotification,
    getNotifications,
    markAsRead,
    deleteNotification,
  };
};

export default useNotifications;
