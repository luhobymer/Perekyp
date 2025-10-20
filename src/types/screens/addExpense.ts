import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExpenseCategory } from '../components/expensesList';

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
 * Опція для вибору автомобіля
 */
export interface CarOption {
  /** Текстова мітка автомобіля */
  label: string;
  /** Значення (ID) автомобіля */
  value: string | number;
}

/**
 * Дані нової витрати
 */
export interface NewExpenseData {
  /** ID автомобіля */
  carId: string | number;
  /** Опис витрати */
  description: string;
  /** Сума витрати */
  amount: number;
  /** Категорія витрати */
  category: ExpenseCategory;
  /** Дата витрати */
  date: Date;
  /** Примітка до витрати */
  note?: string;
}

/**
 * Параметри маршруту для екрану додавання витрати
 */
export interface AddExpenseRouteParams {
  /** ID автомобіля */
  carId?: string | number;
}

/**
 * Пропси для екрану додавання витрати
 */
export interface AddExpenseScreenProps {
  /** Об'єкт маршруту */
  route: RouteProp<{ params: AddExpenseRouteParams }, 'params'>;
  /** Об'єкт навігації */
  navigation: NativeStackNavigationProp<any>;
}
