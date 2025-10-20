import React from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  ListRenderItem 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Notification, NotificationType, NotificationsListProps } from '../types/components/notificationsList';

/**
 * Компонент для відображення списку сповіщень
 */
const NotificationsList: React.FC<NotificationsListProps> = ({ 
  notifications, 
  onRefresh, 
  refreshing, 
  onNotificationPress 
}) => {
  const { theme } = useTheme();

  /**
   * Отримання іконки для типу сповіщення
   */
  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case 'expense':
        return 'cash-outline';
      case 'service':
        return 'build-outline';
      case 'document':
        return 'document-text-outline';
      case 'mileage':
        return 'speedometer-outline';
      case 'status':
        return 'car-outline';
      default:
        return 'notifications-outline';
    }
  };

  /**
   * Отримання заголовка для типу сповіщення
   */
  const getNotificationTitle = (type: NotificationType): string => {
    switch (type) {
      case 'expense':
        return 'Нова витрата';
      case 'service':
        return 'Сервісне обслуговування';
      case 'document':
        return 'Документи';
      case 'mileage':
        return 'Пробіг';
      case 'status':
        return 'Статус автомобіля';
      default:
        return 'Сповіщення';
    }
  };

  /**
   * Рендер елемента сповіщення
   */
  const renderNotificationItem: ListRenderItem<Notification> = ({ item }) => {
    const date = new Date(item.created_at);
    const formattedDate = format(date, 'dd MMMM yyyy, HH:mm', { locale: uk });

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: item.read ? theme.colors.card : theme.colors.primary + '15' },
        ]}
        onPress={() => onNotificationPress(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {getNotificationTitle(item.type)}
          </Text>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            {item.message}
          </Text>
          <Text style={[styles.date, { color: theme.colors.text + '80' }]}>
            {formattedDate}
          </Text>
        </View>
        {!item.read && (
          <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Рендер компонента, коли список порожній
   */
  const renderEmptyComponent = (): JSX.Element => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-off-outline"
        size={64}
        color={theme.colors.text + '50'}
      />
      <Text style={[styles.emptyText, { color: theme.colors.text + '80' }]}>
        У вас немає сповіщень
      </Text>
    </View>
  );

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationsList;
