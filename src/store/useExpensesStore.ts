import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Expense, ExpenseCategory } from '../types/expenses';

/**
 * Інтерфейс стану витрат
 */
interface ExpensesState {
  expenses: Expense[];
  filteredExpenses: Expense[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  filter: {
    carId?: string | number;
    category?: ExpenseCategory;
    dateFrom?: string;
    dateTo?: string;
    amountFrom?: number;
    amountTo?: number;
  };
  stats: {
    totalExpenses: number;
    expensesByCategory: Record<ExpenseCategory, number>;
    expensesByMonth: Record<string, number>;
  };
}

/**
 * Інтерфейс дій для витрат
 */
interface ExpensesActions {
  fetchExpenses: (carId?: string | number) => Promise<void>;
  fetchExpenseById: (id: string | number) => Promise<Expense | null>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Expense | null>;
  updateExpense: (id: string | number, data: Partial<Expense>) => Promise<Expense | null>;
  deleteExpense: (id: string | number) => Promise<boolean>;
  selectExpense: (expense: Expense | null) => void;
  setFilter: (filter: ExpensesState['filter']) => void;
  applyFilter: () => void;
  clearFilter: () => void;
  calculateStats: () => void;
  clearError: () => void;
}

/**
 * Стор для управління витратами
 */
const useExpensesStore = create<ExpensesState & ExpensesActions>((set, get) => ({
  // Початковий стан
  expenses: [],
  filteredExpenses: [],
  selectedExpense: null,
  isLoading: false,
  error: null,
  filter: {},
  stats: {
    totalExpenses: 0,
    expensesByCategory: {
      purchase: 0,
      repair: 0,
      parts: 0,
      fuel: 0,
      insurance: 0,
      tax: 0,
      other: 0
    },
    expensesByMonth: {}
  },

  /**
   * Отримання списку витрат
   * @param carId - опціональний ID автомобіля для фільтрації
   */
  fetchExpenses: async (carId?: string | number) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (carId) {
        query = query.eq('carId', carId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ 
        expenses: data as Expense[], 
        filteredExpenses: data as Expense[],
        isLoading: false 
      });
      
      // Застосовуємо поточний фільтр
      get().applyFilter();
      
      // Розраховуємо статистику
      get().calculateStats();
    } catch (error: any) {
      console.error('Помилка отримання витрат:', error.message);
      set({ 
        error: error.message || 'Помилка отримання витрат', 
        isLoading: false 
      });
    }
  },

  /**
   * Отримання витрати за ID
   * @param id - ID витрати
   */
  fetchExpenseById: async (id: string | number) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ 
        selectedExpense: data as Expense,
        isLoading: false 
      });
      
      return data as Expense;
    } catch (error: any) {
      console.error('Помилка отримання витрати:', error.message);
      set({ 
        error: error.message || 'Помилка отримання витрати', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Додавання нової витрати
   * @param expense - дані витрати
   */
  addExpense: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          { 
            ...expense, 
            createdAt: now, 
            updatedAt: now 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Оновлюємо список витрат
      const newExpense = data as Expense;
      const expenses = [newExpense, ...get().expenses];
      
      set({ 
        expenses,
        filteredExpenses: expenses,
        isLoading: false 
      });
      
      // Застосовуємо поточний фільтр
      get().applyFilter();
      
      // Розраховуємо статистику
      get().calculateStats();
      
      return newExpense;
    } catch (error: any) {
      console.error('Помилка додавання витрати:', error.message);
      set({ 
        error: error.message || 'Помилка додавання витрати', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Оновлення витрати
   * @param id - ID витрати
   * @param data - дані для оновлення
   */
  updateExpense: async (id: string | number, data: Partial<Expense>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: updatedData, error } = await supabase
        .from('expenses')
        .update({ 
          ...data, 
          updatedAt: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedExpense = updatedData as Expense;
      
      // Оновлюємо список витрат
      const expenses = get().expenses.map(expense => 
        expense.id === id ? updatedExpense : expense
      );
      
      set({ 
        expenses,
        filteredExpenses: get().filter ? 
          expenses.filter(expense => applyExpenseFilter(expense, get().filter)) : 
          expenses,
        selectedExpense: get().selectedExpense?.id === id ? updatedExpense : get().selectedExpense,
        isLoading: false 
      });
      
      // Розраховуємо статистику
      get().calculateStats();
      
      return updatedExpense;
    } catch (error: any) {
      console.error('Помилка оновлення витрати:', error.message);
      set({ 
        error: error.message || 'Помилка оновлення витрати', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Видалення витрати
   * @param id - ID витрати
   */
  deleteExpense: async (id: string | number) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Оновлюємо список витрат
      const expenses = get().expenses.filter(expense => expense.id !== id);
      
      set({ 
        expenses,
        filteredExpenses: get().filter ? 
          expenses.filter(expense => applyExpenseFilter(expense, get().filter)) : 
          expenses,
        selectedExpense: get().selectedExpense?.id === id ? null : get().selectedExpense,
        isLoading: false 
      });
      
      // Розраховуємо статистику
      get().calculateStats();
      
      return true;
    } catch (error: any) {
      console.error('Помилка видалення витрати:', error.message);
      set({ 
        error: error.message || 'Помилка видалення витрати', 
        isLoading: false 
      });
      return false;
    }
  },

  /**
   * Вибір витрати
   * @param expense - витрата або null
   */
  selectExpense: (expense: Expense | null) => {
    set({ selectedExpense: expense });
  },

  /**
   * Встановлення фільтра
   * @param filter - параметри фільтрації
   */
  setFilter: (filter: ExpensesState['filter']) => {
    set({ filter });
    get().applyFilter();
  },

  /**
   * Застосування фільтра
   */
  applyFilter: () => {
    const { expenses, filter } = get();
    
    if (!filter || Object.keys(filter).length === 0) {
      set({ filteredExpenses: expenses });
      return;
    }
    
    const filteredExpenses = expenses.filter(expense => applyExpenseFilter(expense, filter));
    set({ filteredExpenses });
  },

  /**
   * Очищення фільтра
   */
  clearFilter: () => {
    set({ 
      filter: {},
      filteredExpenses: get().expenses 
    });
  },

  /**
   * Розрахунок статистики витрат
   */
  calculateStats: () => {
    const { expenses } = get();
    
    // Загальна сума витрат
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Витрати за категоріями
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category as ExpenseCategory;
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {
      purchase: 0,
      repair: 0,
      parts: 0,
      fuel: 0,
      insurance: 0,
      tax: 0,
      other: 0
    } as Record<ExpenseCategory, number>);
    
    // Витрати за місяцями
    const expensesByMonth = expenses.reduce((acc, expense) => {
      const month = expense.date.substring(0, 7); // Формат YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    set({
      stats: {
        totalExpenses,
        expensesByCategory,
        expensesByMonth
      }
    });
  },

  /**
   * Очищення помилки
   */
  clearError: () => {
    set({ error: null });
  }
}));

/**
 * Допоміжна функція для фільтрації витрат
 * @param expense - витрата
 * @param filter - параметри фільтрації
 */
function applyExpenseFilter(expense: Expense, filter: ExpensesState['filter']): boolean {
  // Фільтр за автомобілем
  if (filter.carId && expense.carId !== filter.carId) {
    return false;
  }
  
  // Фільтр за категорією
  if (filter.category && expense.category !== filter.category) {
    return false;
  }
  
  // Фільтр за датою (від)
  if (filter.dateFrom && expense.date < filter.dateFrom) {
    return false;
  }
  
  // Фільтр за датою (до)
  if (filter.dateTo && expense.date > filter.dateTo) {
    return false;
  }
  
  // Фільтр за сумою (від)
  if (filter.amountFrom && expense.amount < filter.amountFrom) {
    return false;
  }
  
  // Фільтр за сумою (до)
  if (filter.amountTo && expense.amount > filter.amountTo) {
    return false;
  }
  
  return true;
}

// Додаємо підтримку devtools для дебагу в браузері
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Підключаємо Redux DevTools для дебагу
  const devtoolsExt = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (devtoolsExt) {
    const devtools = devtoolsExt.connect({
      name: 'Expenses Store',
    });
    
    // Відправляємо початковий стан
    devtools.init(useExpensesStore.getState());
    
    // Підписуємося на зміни стану
    useExpensesStore.subscribe((state) => {
      devtools.send('state_updated', state);
    });
  }
}

export default useExpensesStore;
