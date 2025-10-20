import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import NotificationsList from '../components/NotificationsList';
import { useAuth } from '../contexts/AuthContext';
import { 
  Notification, 
  NotificationsScreenProps, 
  NotificationType 
} from '../types/screens/notifications';

/**
 * Екран для відображення сповіщень користувача
 */
const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Отримання сповіщень з бази даних
   */
  const fetchNotifications = async (): Promise<void> => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error('Помилка при отриманні сповіщень:', (error as Error).message);
    }
  };

  /**
   * Обробник оновлення списку сповіщень
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  /**
   * Обробник натискання на сповіщення
   */
  const handleNotificationPress = async (notification: Notification): Promise<void> => {
    try {
      // Позначаємо сповіщення як прочитане
      if (!notification.read) {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notification.id);

        if (error) throw error;

        // Оновлюємо локальний стан
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        ));
      }

      // Навігація до відповідного екрану в залежності від типу сповіщення
      switch (notification.type as NotificationType) {
        case 'expense':
          navigation.navigate('CarsTab', {
            screen: 'CarDetails',
            params: {
              carId: notification.car_id,
              screen: 'Expenses'
            }
          });
          break;
        case 'service':
          navigation.navigate('CarsTab', {
            screen: 'CarDetails',
            params: {
              carId: notification.car_id,
              screen: 'Service'
            }
          });
          break;
        case 'document':
          navigation.navigate('CarsTab', {
            screen: 'CarDetails',
            params: {
              carId: notification.car_id,
              screen: 'Documents'
            }
          });
          break;
        case 'mileage':
          navigation.navigate('CarsTab', {
            screen: 'CarDetails',
            params: {
              carId: notification.car_id,
              screen: 'Mileage'
            }
          });
          break;
        case 'status':
          navigation.navigate('CarsTab', {
            screen: 'CarDetails',
            params: {
              carId: notification.car_id
            }
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Помилка при обробці сповіщення:', (error as Error).message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();

      // Підписка на нові сповіщення
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NotificationsList
        notifications={notifications}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onNotificationPress={handleNotificationPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NotificationsScreen;
