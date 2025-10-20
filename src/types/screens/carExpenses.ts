import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Expense } from '../../hooks/useExpenses';

/**
 * Категорії витрат з відповідними іконками та кольорами
 */
export type ExpenseCategory = 'purchase' | 'repair' | 'parts' | 'fuel' | 'insurance' | 'tax' | 'other' | 'all';

/**
 * Інформація про категорію витрат
 */
export interface ExpenseCategoryInfo {
  /** Назва іконки з Ionicons */
  icon: string;
  /** Колір категорії */
  color: string;
}

/**
 * Мапа категорій витрат
 */
export interface ExpenseCategoriesMap {
  [key: string]: ExpenseCategoryInfo;
}

/**
 * Елемент фільтра категорій
 */
export interface FilterItem {
  /** Текстова мітка фільтра */
  label: string;
  /** Значення фільтра (категорія) */
  value: ExpenseCategory;
}

/**
 * Параметри маршруту для екрану витрат автомобіля
 */
export interface CarExpensesRouteParams {
  /** ID автомобіля */
  carId?: string;
  /** Нова витрата для додавання */
  newExpense?: Expense | null;
}

/**
 * Пропси для екрану витрат автомобіля
 */
export interface CarExpensesScreenProps {
  /** Об'єкт маршруту */
  route: RouteProp<{ params: CarExpensesRouteParams }, 'params'>;
  /** Об'єкт навігації */
  navigation: NativeStackNavigationProp<any>;
}
