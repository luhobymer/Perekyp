/**
 * Типи для модуля витрат (expenses)
 */

// Категорії витрат
export type ExpenseCategory = 
  | 'purchase' 
  | 'repair' 
  | 'parts' 
  | 'fuel' 
  | 'insurance' 
  | 'tax' 
  | 'other';

// Інформація про категорію витрат
export interface ExpenseCategoryInfo {
  icon: string;
  color: string;
}

// Словник категорій витрат
export interface ExpenseCategoriesDict {
  [key: string]: ExpenseCategoryInfo;
}

// Модель витрати
export interface Expense {
  id: number | string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  note?: string;
  carId?: string | number;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Параметри для екрану витрат
export interface ExpenseScreenParams {
  carId?: string | number;
  newExpense?: Expense | null;
}

// Фільтр для витрат
export interface ExpenseFilter {
  label: string;
  value: ExpenseCategory | 'all';
}

// Пропси для компонента витрат
export interface ExpenseItemProps {
  expense: Expense;
  onPress?: (expense: Expense) => void;
}

// Дані для створення нової витрати
export interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: Date;
  note: string;
  carId: string | number | null;
}

// Валідація форми витрат
export interface ExpenseFormValidation {
  isValid: boolean;
  errors: {
    description?: string;
    amount?: string;
    category?: string;
    carId?: string;
  };
}
