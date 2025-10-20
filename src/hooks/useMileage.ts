import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Mileage, Car } from '../types';

// Додаткові типи для пробігу
export interface MileageWithCar extends Mileage {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface MileageStats {
  totalMileage: number;
  averageDailyMileage: number;
  byMonth: Record<string, number>;
  mileageGrowth: number[];
  lastRecord?: Mileage;
  firstRecord?: Mileage;
}

export const useMileage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання історії пробігу
  const getMileageHistory = useCallback(async (carId: string): Promise<MileageWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mileage_history')
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

      return data as MileageWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання запису пробігу
  const getMileageRecord = useCallback(async (recordId: string): Promise<Mileage> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;

      return data as Mileage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання запису пробігу
  const addMileageRecord = useCallback(async (carId: string, record: Partial<Mileage>): Promise<Mileage> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо поточний пробіг
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('mileage')
        .eq('id', carId)
        .single();

      if (carError) throw carError;

      // Перевіряємо, чи новий пробіг більший за попередній
      if (record.value !== undefined && car.mileage !== undefined && record.value <= car.mileage) {
        throw new Error('Новий пробіг має бути більшим за поточний');
      }

      // Додаємо новий запис
      const { data, error } = await supabase
        .from('mileage_history')
        .insert({
          car_id: carId,
          value: record.value,
          date: record.date || new Date().toISOString(),
          notes: record.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Оновлюємо поточний пробіг автомобіля
      if (record.value !== undefined) {
        const { error: updateError } = await supabase
          .from('cars')
          .update({ mileage: record.value })
          .eq('id', carId);

        if (updateError) throw updateError;
      }

      return data as Mileage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення запису пробігу
  const updateMileageRecord = useCallback(async (recordId: string, updates: Partial<Mileage>): Promise<Mileage> => {
    try {
      setLoading(true);
      setError(null);

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('mileage_history')
        .update(updatesWithTimestamp)
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;

      return data as Mileage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення запису пробігу
  const deleteMileageRecord = useCallback(async (recordId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('mileage_history')
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

  // Отримання статистики пробігу
  const getMileageStats = useCallback(async (carId: string): Promise<MileageStats> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: true });

      if (error) throw error;

      const mileageRecords = data as Mileage[];
      
      // Якщо немає записів, повертаємо нульову статистику
      if (mileageRecords.length === 0) {
        return {
          totalMileage: 0,
          averageDailyMileage: 0,
          byMonth: {},
          mileageGrowth: []
        };
      }

      // Розрахунок середнього денного пробігу
      let totalDailyMileage = 0;
      let totalDays = 0;
      
      for (let i = 1; i < mileageRecords.length; i++) {
        const days = (new Date(mileageRecords[i].date).getTime() - new Date(mileageRecords[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
        if (days > 0) {
          const mileage = mileageRecords[i].value - mileageRecords[i-1].value;
          totalDailyMileage += (mileage / days);
          totalDays++;
        }
      }

      const stats: MileageStats = {
        totalMileage: mileageRecords[mileageRecords.length - 1]?.value || 0,
        averageDailyMileage: totalDays > 0 ? totalDailyMileage / totalDays : 0,
        byMonth: mileageRecords.reduce((acc: Record<string, number>, record) => {
          const month = new Date(record.date).toISOString().slice(0, 7);
          acc[month] = record.value;
          return acc;
        }, {}),
        mileageGrowth: mileageRecords.map((record, index) => {
          if (index === 0) return 0;
          return record.value - mileageRecords[index - 1].value;
        }),
        lastRecord: mileageRecords[mileageRecords.length - 1],
        firstRecord: mileageRecords[0]
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

  // Отримання пробігу за період
  const getMileageByPeriod = useCallback(async (carId: string, startDate: string, endDate: string): Promise<Mileage[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;

      return data as Mileage[];
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
    getMileageHistory,
    getMileageRecord,
    addMileageRecord,
    updateMileageRecord,
    deleteMileageRecord,
    getMileageStats,
    getMileageByPeriod
  };
};

export default useMileage;
