import { useState, useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

// Типи для календаря
export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
  calendarId: string;
}

export interface UpdateCalendarEvent extends CalendarEvent {
  eventId: string;
}

export interface GetEventsParams {
  startDate: Date;
  endDate: Date;
  calendarIds?: string[];
}

export interface CalendarHook {
  calendars: Calendar.Calendar[];
  error: string | null;
  isLoading: boolean;
  isWeb: boolean;
  createEvent: (event: CalendarEvent) => Promise<string | null>;
  updateEvent: (event: UpdateCalendarEvent) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  getEvents: (params: GetEventsParams) => Promise<Calendar.Event[]>;
  getEventById: (eventId: string) => Promise<Calendar.Event | null>;
  requestCalendarPermissions: () => Promise<void>;
}

export const useCalendar = (): CalendarHook => {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWeb] = useState<boolean>(Platform.OS === 'web');

  useEffect(() => {
    if (!isWeb) {
      requestCalendarPermissions();
    } else {
      setError('Календар не доступний у веб-версії додатка');
    }
  }, [isWeb]);

  const requestCalendarPermissions = async (): Promise<void> => {
    if (isWeb) return; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        await loadCalendars();
      } else {
        throw new Error('Дозвіл на доступ до календаря не надано');
      }
    } catch (error) {
      setError('Помилка отримання дозволу на доступ до календаря');
      console.error('Error requesting calendar permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCalendars = async (): Promise<Calendar.Calendar[]> => {
    if (isWeb) return []; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      const calendarsData = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      setCalendars(calendarsData);
      return calendarsData;
    } catch (error) {
      setError('Помилка завантаження календарів');
      console.error('Error loading calendars:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async ({
    title,
    startDate,
    endDate,
    notes,
    location,
    calendarId,
  }: CalendarEvent): Promise<string | null> => {
    if (isWeb) return null; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      const eventId = await Calendar.createEventAsync(calendarId, {
        title,
        startDate,
        endDate,
        notes,
        location,
        alarms: [{ relativeOffset: -60 }], // Нагадування за годину
        timeZone: 'Europe/Kiev',
      });

      return eventId;
    } catch (error) {
      setError('Помилка створення події');
      console.error('Error creating event:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async ({
    eventId,
    title,
    startDate,
    endDate,
    notes,
    location,
    calendarId,
  }: UpdateCalendarEvent): Promise<boolean> => {
    if (isWeb) return false; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      await Calendar.updateEventAsync(eventId, {
        title,
        startDate,
        endDate,
        notes,
        location,
        alarms: [{ relativeOffset: -60 }],
        timeZone: 'Europe/Kiev',
      });

      return true;
    } catch (error) {
      setError('Помилка оновлення події');
      console.error('Error updating event:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (isWeb) return false; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      setError('Помилка видалення події');
      console.error('Error deleting event:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getEvents = async ({
    startDate,
    endDate,
    calendarIds = calendars.map((cal) => cal.id),
  }: GetEventsParams): Promise<Calendar.Event[]> => {
    if (isWeb) return []; // Не виконуємо на веб-платформі і повертаємо порожній масив
    
    try {
      setIsLoading(true);
      setError(null);

      const events = await Calendar.getEventsAsync(
        calendarIds,
        startDate,
        endDate
      );

      return events;
    } catch (error) {
      setError('Помилка отримання подій');
      console.error('Error getting events:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getEventById = async (eventId: string): Promise<Calendar.Event | null> => {
    if (isWeb) return null; // Не виконуємо на веб-платформі
    
    try {
      setIsLoading(true);
      setError(null);

      const event = await Calendar.getEventByIdAsync(eventId);
      return event;
    } catch (error) {
      setError('Помилка отримання події');
      console.error('Error getting event:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    calendars,
    error,
    isLoading,
    isWeb,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEventById,
    requestCalendarPermissions,
  };
}; 

export default useCalendar;
