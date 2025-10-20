import { StyleProp, ViewStyle, TextStyle, ListRenderItem } from 'react-native';
import { Expense } from '../../hooks/useExpenses';

/**
 * Категорії витрат
 */
export type ExpenseCategory = 
  | 'all'         // Всі категорії
  | 'fuel'        // Паливо
  | 'service'     // ТО та обслуговування
  | 'repair'      // Ремонт
  | 'insurance'   // Страхування
  | 'tax'         // Податки та збори
  | 'parking'     // Парковка
  | 'washing'     // Миття
  | 'parts'       // Запчастини
  | 'accessories' // Аксесуари
  | 'fines'       // Штрафи
  | 'tolls'       // Плата за дороги
  | 'other';      // Інші витрати

/**
 * Пропси для компонента ExpensesList
 */
export interface ExpensesListProps {
  /**
   * ID автомобіля, для якого відображаються витрати
   */
  carId: string;
  
  /**
   * Масив витрат для відображення
   * Якщо не вказано, витрати будуть завантажені за допомогою хука useExpenses
   */
  expenses?: Expense[];
  
  /**
   * Чи відображати фільтр за категоріями
   * @default true
   */
  showCategoryFilter?: boolean;
  
  /**
   * Чи відображати загальну суму витрат
   * @default true
   */
  showTotalAmount?: boolean;
  
  /**
   * Чи дозволити додавання нових витрат
   * @default true
   */
  allowAdding?: boolean;
  
  /**
   * Чи дозволити редагування витрат
   * @default true
   */
  allowEditing?: boolean;
  
  /**
   * Чи дозволити видалення витрат
   * @default true
   */
  allowDeletion?: boolean;
  
  /**
   * Чи відображати індикатор завантаження
   * @default true
   */
  showLoadingIndicator?: boolean;
  
  /**
   * Чи дозволити оновлення списку свайпом вниз
   * @default true
   */
  pullToRefresh?: boolean;
  
  /**
   * Обробник натискання на витрату
   */
  onExpensePress?: (expense: Expense) => void;
  
  /**
   * Обробник додавання нової витрати
   */
  onAddExpense?: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  
  /**
   * Обробник оновлення витрати
   */
  onUpdateExpense?: (expense: Expense) => Promise<void>;
  
  /**
   * Обробник видалення витрати
   */
  onDeleteExpense?: (expenseId: string) => Promise<void>;
  
  /**
   * Додаткові стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка
   */
  headerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка тексту
   */
  headerTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для списку
   */
  listStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для елемента списку
   */
  itemStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту елемента списку
   */
  itemTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопки додавання
   */
  addButtonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопки додавання
   */
  addButtonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Кастомний компонент для відображення витрати
   */
  renderItem?: ListRenderItem<Expense>;
  
  /**
   * Кастомний компонент для відображення заголовка
   */
  renderHeader?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення підвалу
   */
  renderFooter?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення порожнього стану
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення помилки
   */
  renderError?: (error: Error) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення завантаження
   */
  renderLoading?: () => React.ReactNode;
}

/**
 * Властивості для фільтрації витрат
 */
export interface ExpensesFilterOptions {
  /**
   * Категорія витрат
   */
  category?: ExpenseCategory;
  
  /**
   * Початкова дата періоду
   */
  startDate?: Date;
  
  /**
   * Кінцева дата періоду
   */
  endDate?: Date;
  
  /**
   * Мінімальна сума
   */
  minAmount?: number;
  
  /**
   * Максимальна сума
   */
  maxAmount?: number;
  
  /**
   * Пошуковий запит
   */
  searchQuery?: string;
}

/**
 * Опції сортування витрат
 */
export type ExpensesSortOption = 
  | 'date-desc'   // За датою (новіші перші)
  | 'date-asc'    // За датою (старіші перші)
  | 'amount-desc' // За сумою (за спаданням)
  | 'amount-asc'  // За сумою (за зростанням)
  | 'category'    // За категорією
  | 'odometer';    // За пробігом
