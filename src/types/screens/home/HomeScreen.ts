import { StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Оновлення бізнес-даних
 */
export interface BusinessUpdate {
  /**
   * Унікальний ідентифікатор оновлення
   */
  id: string;
  
  /**
   * Тип дії (наприклад, "Витрачено", "Продано", "Додано")
   */
  action: string;
  
  /**
   * Сума операції
   */
  amount: string;
  
  /**
   * Об'єкт дії
   */
  target: string;
  
  /**
   * Пов'язаний автомобіль
   */
  car: string;
  
  /**
   * Виконавець дії
   */
  performer: string;
  
  /**
   * Дата у відформатованому вигляді
   */
  date: string;
  
  /**
   * Часова мітка для сортування
   */
  timestamp: number;
}

/**
 * Статистика бізнесу
 */
export interface BusinessStats {
  /**
   * Загальна кількість автомобілів
   */
  totalCars: number;
  
  /**
   * Загальна вартість активів
   */
  totalValue: number;
  
  /**
   * Загальний прибуток
   */
  totalProfit: number;
  
  /**
   * Загальні витрати
   */
  totalExpenses: number;
  
  /**
   * Кількість проданих автомобілів
   */
  soldCars: number;
  
  /**
   * Кількість активних автомобілів
   */
  activeCars: number;
}

/**
 * Віджет дашборду
 */
export interface DashboardWidget {
  /**
   * Унікальний ідентифікатор віджета
   */
  id: string;
  
  /**
   * Назва віджета
   */
  title: string;
  
  /**
   * Значення
   */
  value: string | number;
  
  /**
   * Зміна значення порівняно з попереднім періодом
   */
  change?: number;
  
  /**
   * Іконка
   */
  icon: string;
  
  /**
   * Колір іконки
   */
  color: string;
  
  /**
   * Обробник натискання
   */
  onPress?: () => void;
}

/**
 * Властивості екрану домашньої сторінки
 */
export interface HomeScreenProps {
  /**
   * Додаткові стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для вмісту
   */
  contentStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для підзаголовка
   */
  subtitleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для карток статистики
   */
  statsCardStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для списку оновлень
   */
  updatesListStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для елемента списку оновлень
   */
  updateItemStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту оновлення
   */
  updateTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для дати оновлення
   */
  updateDateStyle?: StyleProp<TextStyle>;
  
  /**
   * Кастомний компонент для відображення заголовка
   */
  renderHeader?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення статистики
   */
  renderStats?: (stats: BusinessStats) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення списку оновлень
   */
  renderUpdates?: (updates: BusinessUpdate[]) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення стану завантаження
   */
  renderLoading?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення стану помилки
   */
  renderError?: (error: Error) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення стану порожнього списку
   */
  renderEmpty?: () => React.ReactNode;
}

/**
 * Параметри навігації для домашнього екрану
 */
export type HomeScreenParams = {
  /**
   * Флаг оновлення даних
   */
  refresh?: boolean;
  
  /**
   * Додаткові параметри
   */
  [key: string]: any;
};
