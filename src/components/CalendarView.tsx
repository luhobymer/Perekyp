import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useCalendar, CalendarHook } from '../hooks/useCalendar';
import { useTheme } from '../hooks/useTheme';
import { getResponsiveValue } from '../styles/responsiveStyles';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { CalendarViewProps } from '../types/screens/calendar';
import * as Calendar from 'expo-calendar';

/**
 * Компонент для відображення календаря та подій
 */
export const CalendarView: React.FC<CalendarViewProps> = ({ onEventPress }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    calendars,
    error,
    isLoading,
    isWeb,
    getEvents,
    getEventById,
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Calendar.Event | null>(null);

  useEffect(() => {
    if (!isWeb) {
      loadEvents();
    }
  }, [selectedDate, isWeb]);

  /**
   * Завантаження подій для вибраної дати
   */
  const loadEvents = async (): Promise<void> => {
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const eventsData = await getEvents({
      startDate,
      endDate,
    });
    setEvents(eventsData);
  };

  /**
   * Обробник вибору дати
   */
  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
  };

  /**
   * Обробник натискання на подію
   */
  const handleEventPress = async (eventId: string): Promise<void> => {
    const event = await getEventById(eventId);
    if (event) {
      setSelectedEvent(event);
      if (onEventPress) {
        onEventPress({
          id: event.id,
          title: event.title,
          date: event.startDate.toISOString(),
          userId: event.calendarId, // Використовуємо calendarId як userId
        });
      }
    }
  };

  /**
   * Рендер елемента події
   */
  const renderEvent = ({ item }: { item: Calendar.Event }): JSX.Element => (
    <TouchableOpacity
      style={[
        styles.eventItem,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => handleEventPress(item.id)}
    >
      <View style={styles.eventTime}>
        <Text
          style={[
            styles.eventTimeText,
            { color: theme.colors.text },
          ]}
        >
          {format(new Date(item.startDate), 'HH:mm')}
        </Text>
      </View>
      <View style={styles.eventContent}>
        <Text
          style={[
            styles.eventTitle,
            { color: theme.colors.text },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        {item.location && (
          <Text
            style={[
              styles.eventLocation,
              { color: theme.colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Відображення спеціального повідомлення для веб-версії
  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <Text style={[styles.webTitle, { color: theme.colors.text }]}>
          {t('web_version_limitation')}
        </Text>
        <Text style={[styles.webText, { color: theme.colors.textSecondary }]}>
          {t('calendar_not_available_web')}
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text },
          ]}
        >
          {format(selectedDate, 'MMMM yyyy', { locale: uk })}
        </Text>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t('no_events_for_day', 'Немає подій на цей день')}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  webText: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  eventsList: {
    padding: 16,
  },
  eventItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  eventTime: {
    width: 60,
    justifyContent: 'center',
  },
  eventTimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
