/**
 * Типи для компонента списку сповіщень
 */

/**
 * Типи сповіщень
 */
export type NotificationType = 'expense' | 'service' | 'document' | 'mileage' | 'status' | 'default';

/**
 * Інтерфейс для сповіщення
 */
export interface Notification {
  /**
   * Унікальний ідентифікатор сповіщення
   */
  id: string | number;
  
  /**
   * Тип сповіщення
   */
  type: NotificationType;
  
  /**
   * Текст сповіщення
   */
  message: string;
  
  /**
   * Дата створення сповіщення
   */
  created_at: string;
  
  /**
   * Чи прочитане сповіщення
   */
  read: boolean;
  
  /**
   * Додаткові дані сповіщення
   */
  data?: Record<string, any>;
}

/**
 * Пропси для компонента списку сповіщень
 */
export interface NotificationsListProps {
  /**
   * Масив сповіщень
   */
  notifications: Notification[];
  
  /**
   * Функція, яка викликається при оновленні списку
   */
  onRefresh: () => void;
  
  /**
   * Чи відбувається оновлення списку
   */
  refreshing: boolean;
  
  /**
   * Функція, яка викликається при натисканні на сповіщення
   */
  onNotificationPress: (notification: Notification) => void;
}
