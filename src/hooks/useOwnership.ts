import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Car } from '../types';

// Додаткові типи для історії власності
export interface OwnershipRecord {
  id: string;
  car_id: string;
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  start_date: string;
  end_date?: string | null;
  purchase_price?: number;
  sale_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnershipWithCar extends OwnershipRecord {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface OwnershipStats {
  totalOwners: number;
  averageOwnershipDuration: number;
  totalProfit: number;
}

export const useOwnership = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання історії власності
  const getOwnershipHistory = useCallback(async (carId: string): Promise<OwnershipWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ownership_history')
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
        .order('start_date', { ascending: false });

      if (error) throw error;

      return data as OwnershipWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання запису про власність
  const getOwnershipRecord = useCallback(async (recordId: string): Promise<OwnershipRecord> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;

      return data as OwnershipRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання запису про власність
  const addOwnershipRecord = useCallback(async (carId: string, record: Partial<OwnershipRecord>): Promise<OwnershipRecord> => {
    try {
      setLoading(true);
      setError(null);

      // Перевіряємо, чи немає перекриття дат
      const { data: existingRecords, error: checkError } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('car_id', carId)
        .or(`start_date.lte.${record.end_date},end_date.gte.${record.start_date}`);

      if (checkError) throw checkError;

      if (existingRecords && existingRecords.length > 0) {
        throw new Error('Період володіння перекривається з існуючими записами');
      }

      const { data, error } = await supabase
        .from('ownership_history')
        .insert({
          car_id: carId,
          owner_name: record.owner_name,
          owner_phone: record.owner_phone,
          owner_email: record.owner_email,
          start_date: record.start_date,
          end_date: record.end_date,
          purchase_price: record.purchase_price,
          sale_price: record.sale_price,
          notes: record.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as OwnershipRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення запису про власність
  const updateOwnershipRecord = useCallback(async (recordId: string, updates: Partial<OwnershipRecord>): Promise<OwnershipRecord> => {
    try {
      setLoading(true);
      setError(null);

      // Якщо оновлюються дати, перевіряємо перекриття
      if (updates.start_date || updates.end_date) {
        const { data: record } = await supabase
          .from('ownership_history')
          .select('car_id,start_date,end_date')
          .eq('id', recordId)
          .single();

        const { data: existingRecords, error: checkError } = await supabase
          .from('ownership_history')
          .select('*')
          .eq('car_id', record.car_id)
          .neq('id', recordId)
          .or(`start_date.lte.${updates.end_date || record.end_date},end_date.gte.${updates.start_date || record.start_date}`);

        if (checkError) throw checkError;

        if (existingRecords && existingRecords.length > 0) {
          throw new Error('Період володіння перекривається з існуючими записами');
        }
      }

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ownership_history')
        .update(updatesWithTimestamp)
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;

      return data as OwnershipRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення запису про власність
  const deleteOwnershipRecord = useCallback(async (recordId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('ownership_history')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання поточного власника
  const getCurrentOwner = useCallback(async (carId: string): Promise<OwnershipRecord | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('car_id', carId)
        .is('end_date', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // код для "Не знайдено"
          return null;
        }
        throw error;
      }

      return data as OwnershipRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання статистики володіння
  const getOwnershipStats = useCallback(async (carId: string): Promise<OwnershipStats> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('car_id', carId);

      if (error) throw error;

      const records = data as OwnershipRecord[];
      
      // Якщо немає записів, повертаємо нульову статистику
      if (records.length === 0) {
        return {
          totalOwners: 0,
          averageOwnershipDuration: 0,
          totalProfit: 0
        };
      }

      // Розрахунок статистики
      let totalDuration = 0;
      let totalProfit = 0;
      let validDurationCount = 0;
      let validProfitCount = 0;
      
      records.forEach(record => {
        const start = new Date(record.start_date);
        const end = record.end_date ? new Date(record.end_date) : new Date();
        const duration = end.getTime() - start.getTime();
        
        if (duration > 0) {
          totalDuration += duration;
          validDurationCount++;
        }
        
        if (record.sale_price !== undefined && record.purchase_price !== undefined) {
          totalProfit += (record.sale_price - record.purchase_price);
          validProfitCount++;
        }
      });

      const stats: OwnershipStats = {
        totalOwners: records.length,
        averageOwnershipDuration: validDurationCount > 0 ? totalDuration / validDurationCount : 0,
        totalProfit: totalProfit
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

  return {
    loading,
    error,
    getOwnershipHistory,
    getOwnershipRecord,
    addOwnershipRecord,
    updateOwnershipRecord,
    deleteOwnershipRecord,
    getCurrentOwner,
    getOwnershipStats
  };
};

export default useOwnership;
