import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

// Типи для витрат
export interface Expense {
  id: string;
  car_id: string;
  expense_type: string;
  amount: number;
  date: string;
  description?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithCar extends Expense {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface ExpenseStats {
  total: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
  averagePerMonth: number;
  count: number;
}

export interface ExpensePeriodFilter {
  month?: number;
  year?: number;
  carId?: string;
}

export interface ImagePickResult {
  uri: string;
  type?: string;
  name?: string;
}

export const useExpenses = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання списку витрат
  const getExpenses = useCallback(async (carId: string): Promise<ExpenseWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .select(`
          *,
          cars (
            brand,
            model,
            year,
            registration_number
          )
        `)
        .eq('car_id', carId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data as ExpenseWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання витрати
  const getExpense = useCallback(async (expenseId: string): Promise<Expense> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('id', expenseId)
        .single();

      if (error) throw error;

      return data as Expense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання витрати
  const addExpense = useCallback(async (carId: string, expense: Partial<Expense>): Promise<Expense> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .insert({
          car_id: carId,
          expense_type: expense.expense_type,
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          receipt_url: expense.receipt_url,
          notes: expense.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as Expense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення витрати
  const updateExpense = useCallback(async (expenseId: string, updates: Partial<Expense>): Promise<Expense> => {
    try {
      setLoading(true);
      setError(null);

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('car_expenses')
        .update(updatesWithTimestamp)
        .eq('id', expenseId)
        .select()
        .single();

      if (error) throw error;

      return data as Expense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення витрати
  const deleteExpense = useCallback(async (expenseId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('car_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання статистики витрат
  const getExpenseStats = useCallback(async (carId: string): Promise<ExpenseStats> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId);

      if (error) throw error;

      const expenses = data as Expense[];
      
      // Підрахунок унікальних місяців
      const uniqueMonths = new Set(
        expenses.map(expense => new Date(expense.date).toISOString().slice(0, 7))
      );
      
      const monthCount = uniqueMonths.size || 1; // Щоб уникнути ділення на нуль

      const stats: ExpenseStats = {
        total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
        byType: expenses.reduce((acc: Record<string, number>, expense) => {
          acc[expense.expense_type] = (acc[expense.expense_type] || 0) + expense.amount;
          return acc;
        }, {}),
        byMonth: expenses.reduce((acc: Record<string, number>, expense) => {
          const month = new Date(expense.date).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {}),
        averagePerMonth: expenses.reduce((sum, expense) => sum + expense.amount, 0) / monthCount,
        count: expenses.length
      };

      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання витрат за період
  const getExpensesByPeriod = useCallback(async (carId: string, startDate: string, endDate: string): Promise<Expense[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;

      return data as Expense[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання витрат за типом
  const getExpensesByType = useCallback(async (carId: string, expenseType: string): Promise<Expense[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId)
        .eq('expense_type', expenseType)
        .order('date', { ascending: false });

      if (error) throw error;

      return data as Expense[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантаження чека
  const uploadReceipt = useCallback(async (expenseId: string, image: ImagePickResult): Promise<Expense> => {
    try {
      setLoading(true);
      setError(null);

      // Завантажуємо зображення в Supabase Storage
      const fileExt = image.uri.split('.').pop() || 'jpg';
      const fileName = `${expenseId}_${Date.now()}.${fileExt}`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Копіюємо файл в локальну директорію
      await FileSystem.copyAsync({
        from: image.uri,
        to: filePath
      });

      // Завантажуємо файл в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, {
          uri: filePath,
          type: image.type || 'image/jpeg',
          name: image.name || fileName
        });

      if (uploadError) throw uploadError;

      // Отримуємо публічний URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      // Оновлюємо запис в базі даних
      const { data, error } = await supabase
        .from('car_expenses')
        .update({ 
          receipt_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', expenseId)
        .select()
        .single();

      if (error) throw error;

      // Видаляємо локальну копію
      await FileSystem.deleteAsync(filePath);

      return data as Expense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Вибір зображення
  const pickImage = useCallback(async (): Promise<ImagePickResult | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri
        };
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Відкриття чека
  const openReceipt = useCallback(async (receiptUrl: string): Promise<void> => {
    try {
      await Sharing.shareAsync(receiptUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Отримання загальної суми витрат за період
  const getTotalExpenses = useCallback(async (filter: ExpensePeriodFilter = {}): Promise<number> => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('car_expenses')
        .select('*');

      // Фільтрація за автомобілем, якщо вказано
      if (filter.carId) {
        query = query.eq('car_id', filter.carId);
      }

      // Фільтрація за місяцем і роком, якщо вказано
      if (filter.month && filter.year) {
        const startDate = new Date(filter.year, filter.month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(filter.year, filter.month, 0).toISOString().split('T')[0];
        
        query = query
          .gte('date', startDate)
          .lte('date', endDate);
      } else if (filter.year) {
        const startDate = new Date(filter.year, 0, 1).toISOString().split('T')[0];
        const endDate = new Date(filter.year, 11, 31).toISOString().split('T')[0];
        
        query = query
          .gte('date', startDate)
          .lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Підрахунок загальної суми
      const expenses = data as Expense[];
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return total;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка отримання загальних витрат:', err);
      return 0; // У випадку помилки повертаємо 0
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
    getExpensesByPeriod,
    getExpensesByType,
    uploadReceipt,
    pickImage,
    openReceipt,
    getTotalExpenses
  };
};

export default useExpenses;
