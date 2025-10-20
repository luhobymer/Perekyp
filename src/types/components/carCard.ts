/**
 * Типи статусів автомобіля
 */
export type CarStatus = 'checking' | 'purchased' | 'repairing' | 'sold' | string;

/**
 * Інтерфейс для даних автомобіля
 */
export interface Car {
  /** Унікальний ідентифікатор автомобіля */
  id: string;
  /** Марка автомобіля */
  brand: string;
  /** Модель автомобіля */
  model: string;
  /** Альтернативна назва марки */
  make?: string;
  /** Рік випуску */
  year: number;
  /** URL зображення автомобіля */
  image_url?: string;
  /** Статус автомобіля */
  status: CarStatus;
  /** Ціна покупки */
  purchase_price?: number;
  /** Ціна продажу */
  selling_price?: number;
  /** Загальна сума витрат */
  total_expenses?: number;
  /** Пробіг автомобіля */
  mileage?: number;
  /** VIN-код автомобіля */
  vin?: string;
  /** Нотатки про автомобіль */
  notes?: string;
  /** Валюта (за замовчуванням USD) */
  currency?: string;
  /** Дата створення запису */
  createdAt?: string;
  /** Дата оновлення запису */
  updatedAt?: string;
}

/**
 * Пропси для компонента CarCard
 */
export interface CarCardProps {
  /** Дані автомобіля */
  car: Car;
  /** Функція, яка викликається при натисканні на картку */
  onPress?: () => void;
  /** Функція, яка викликається при натисканні на кнопку видалення */
  onDelete?: () => void;
  /** Індекс картки для анімації */
  index?: number;
}
