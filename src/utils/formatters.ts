import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

type DateValue = string | Date | null | undefined;
type CurrencyCode = 'UAH' | 'USD' | 'EUR' | string;
type CarStatus = 'active' | 'sold' | 'reserved' | 'service' | string;

/**
 * Форматує дату у локалізований рядок
 * @param date - Дата для форматування
 * @param formatStr - Рядок формату (за замовчуванням 'dd.MM.yyyy')
 * @returns Форматована дата або рядок "Не вказано" у разі помилки
 */
export const formatDate = (date: DateValue, formatStr: string = 'dd.MM.yyyy'): string => {
  if (!date) return 'Не вказано';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: uk });
  } catch (error) {
    console.error('Помилка форматування дати:', error);
    return 'Невірна дата';
  }
};

/**
 * Форматує число як грошову суму
 * @param amount - Сума для форматування
 * @param currency - Валюта (за замовчуванням 'UAH')
 * @returns Форматована сума або рядок "Не вказано" у разі помилки
 */
export const formatCurrency = (amount: number | null | undefined, currency: CurrencyCode = 'UAH'): string => {
  if (amount === undefined || amount === null) return 'Не вказано';
  
  try {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Помилка форматування валюти:', error);
    return `${amount} грн`;
  }
};

/**
 * Форматує число з розділювачами розрядів
 * @param number - Число для форматування
 * @returns Форматоване число або рядок "Не вказано" у разі помилки
 */
export const formatNumber = (number: number | null | undefined): string => {
  if (number === undefined || number === null) return 'Не вказано';
  
  try {
    return new Intl.NumberFormat('uk-UA').format(number);
  } catch (error) {
    console.error('Помилка форматування числа:', error);
    return number.toString();
  }
};

/**
 * Форматує відстань у кілометрах
 * @param kilometers - Кілометри
 * @returns Форматована відстань або рядок "Не вказано" у разі помилки
 */
export const formatDistance = (kilometers: number | null | undefined): string => {
  if (kilometers === undefined || kilometers === null) return 'Не вказано';
  
  try {
    return `${formatNumber(kilometers)} км`;
  } catch (error) {
    console.error('Помилка форматування відстані:', error);
    return `${kilometers} км`;
  }
};

/**
 * Форматує об'єм двигуна
 * @param capacity - Об'єм двигуна в літрах
 * @returns Форматований об'єм або рядок "Не вказано" у разі помилки
 */
export const formatEngineCapacity = (capacity: number | null | undefined): string => {
  if (capacity === undefined || capacity === null) return 'Не вказано';
  
  try {
    return `${capacity.toFixed(1)} л`;
  } catch (error) {
    console.error('Помилка форматування об\'єму двигуна:', error);
    return `${capacity} л`;
  }
};

/**
 * Форматує відсоток
 * @param percent - Відсоток (0-1)
 * @returns Форматований відсоток або рядок "Не вказано" у разі помилки
 */
export const formatPercent = (percent: number | null | undefined): string => {
  if (percent === undefined || percent === null) return 'Не вказано';
  
  try {
    return `${(percent * 100).toFixed(0)}%`;
  } catch (error) {
    console.error('Помилка форматування відсотка:', error);
    return `${percent * 100}%`;
  }
};

/**
 * Скорочує текст до певної довжини
 * @param text - Текст для скорочення
 * @param maxLength - Максимальна довжина (за замовчуванням 100)
 * @returns Скорочений текст або порожній рядок, якщо текст не передано
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Форматує телефонний номер
 * @param phoneNumber - Номер телефону
 * @returns Форматований номер або рядок "Не вказано", якщо номер не передано
 */
export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return 'Не вказано';
  
  // Видаляємо всі нецифрові символи
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Форматуємо як +380 XX XXX XX XX
  if (cleaned.length === 12 && cleaned.startsWith('380')) {
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8, 10)} ${cleaned.substring(10, 12)}`;
  }
  
  // Форматуємо як 0XX XXX XX XX
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9, 11)}`;
  }
  
  return phoneNumber;
};

/**
 * Форматує статус автомобіля
 * @param status - Статус автомобіля
 * @returns Локалізований статус або "Невідомо", якщо статус невідомий
 */
export const formatCarStatus = (status: CarStatus | null | undefined): string => {
  switch (status) {
    case 'active':
      return 'В наявності';
    case 'sold':
      return 'Продано';
    case 'reserved':
      return 'Зарезервовано';
    case 'service':
      return 'На сервісі';
    default:
      return status || 'Невідомо';
  }
};
