/**
 * Типи документів для автомобіля
 */
export type DocumentType =
  | 'registration' // Документ про реєстрацію ТЗ
  | 'insurance'     // Страховий поліс
  | 'inspection'    // Техогляд
  | 'purchase'      // Договір купівлі-продажу
  | 'maintenance'   // ТО
  | 'warranty'      // Гарантія
  | 'invoice'       // Рахунок-фактура
  | 'contract'      // Договір
  | 'passport'      // Паспорт ТЗ
  | 'other';        // Інший тип документа

/**
 * Статуси документів
 */
export type DocumentStatus =
  | 'active'    // Дійсний
  | 'expired'   // Протермінований
  | 'pending'   // Очікує підтвердження
  | 'rejected'; // Відхилений

/**
 * Статуси синхронізації
 */
export type SyncStatus =
  | 'idle'     // Не синхронізовано
  | 'syncing'  // Триває синхронізація
  | 'synced'   // Успішно синхронізовано
  | 'error';   // Помилка синхронізації

/**
 * Базовий інтерфейс для всіх сутностей з ідентифікатором
 */
export interface Identifiable {
  /**
   * Унікальний ідентифікатор сутності
   */
  id: string;
}

/**
 * Базовий інтерфейс для сутностей з часом створення та оновлення
 */
export interface Timestamped extends Identifiable {
  /**
   * Час створення запису
   */
  createdAt: Date | string;
  
  /**
   * Час останнього оновлення запису
   */
  updatedAt: Date | string;
}

/**
 * Базовий інтерфейс для сутностей, що підтримують синхронізацію
 */
export interface Syncable extends Timestamped {
  /**
   * Стан синхронізації з сервером
   */
  syncStatus: SyncStatus;
  
  /**
   * Повідомлення про помилку при синхронізації
   */
  syncError?: string;
  
  /**
   * Час останньої успішної синхронізації
   */
  lastSyncedAt?: Date | string;
}

/**
 * Пагінація
 */
export interface Pagination {
  /**
   * Поточна сторінка (починається з 1)
   */
  page: number;
  
  /**
   * Кількість елементів на сторінці
   */
  pageSize: number;
  
  /**
   * Загальна кількість елементів
   */
  total: number;
  
  /**
   * Загальна кількість сторінок
   */
  totalPages: number;
}

/**
 * Параметри сортування
 */
export interface SortOptions<T> {
  /**
   * Поле для сортування
   */
  field: keyof T;
  
  /**
   * Напрямок сортування
   */
  direction: 'asc' | 'desc';
}

/**
 * Параметри фільтрації
 */
export type FilterOptions<T> = Partial<Record<keyof T, any>>;

/**
 * Результат пагінованого запиту
 */
export interface PaginatedResult<T> {
  /**
   * Масив елементів
   */
  items: T[];
  
  /**
   * Інформація про пагінацію
   */
  pagination: Pagination;
  
  /**
   * Параметри сортування
   */
  sort?: SortOptions<T>;
  
  /**
   * Параметри фільтрації
   */
  filters?: FilterOptions<T>;
}

/**
 * Параметри пагінованого запиту
 */
export interface PaginationParams {
  /**
   * Номер сторінки (починається з 1)
   */
  page?: number;
  
  /**
   * Кількість елементів на сторінці
   */
  pageSize?: number;
  
  /**
   * Поле для сортування
   */
  sortBy?: string;
  
  /**
   * Напрямок сортування
   */
  sortDirection?: 'asc' | 'desc';
}
