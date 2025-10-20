/**
 * Типи для екрану календаря
 */

/**
 * Інтерфейс для події календаря
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  carId?: string;
  userId: string;
  isAllDay?: boolean;
  reminder?: boolean;
  reminderTime?: number; // час у хвилинах до події
  type?: 'service' | 'payment' | 'meeting' | 'other';
}

/**
 * Пропси для компонента форми події
 */
export interface EventFormProps {
  event: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

/**
 * Пропси для компонента перегляду календаря
 */
export interface CalendarViewProps {
  onEventPress: (event: CalendarEvent) => void;
}
