import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Buyer } from '../types';

// Додаткові типи для покупців
export interface BuyerWithCar extends Buyer {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface BuyerStats {
  total: number;
  bySource: Record<string, number>;
  averageResponseTime: number;
}

export const useBuyers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання списку покупців
  const getBuyers = useCallback(async (carId: string): Promise<Buyer[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Buyer[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання покупця
  const getBuyer = useCallback(async (buyerId: string): Promise<Buyer> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('id', buyerId)
        .single();

      if (error) throw error;

      return data as Buyer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання покупця
  const addBuyer = useCallback(async (carId: string, buyer: Partial<Buyer>): Promise<Buyer> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buyers')
        .insert({
          car_id: carId,
          name: buyer.name,
          phone: buyer.phone,
          email: buyer.email,
          address: buyer.address,
          notes: buyer.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as Buyer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення покупця
  const updateBuyer = useCallback(async (buyerId: string, updates: Partial<Buyer>): Promise<Buyer> => {
    try {
      setLoading(true);
      setError(null);

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('buyers')
        .update(updatesWithTimestamp)
        .eq('id', buyerId)
        .select()
        .single();

      if (error) throw error;

      return data as Buyer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення покупця
  const deleteBuyer = useCallback(async (buyerId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('buyers')
        .delete()
        .eq('id', buyerId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання історії покупців для автомобіля
  const getBuyerHistory = useCallback(async (carId: string): Promise<BuyerWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buyers')
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as BuyerWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання статистики по покупцях
  const getBuyerStats = useCallback(async (carId: string): Promise<BuyerStats> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('car_id', carId);

      if (error) throw error;

      const buyers = data as Buyer[];
      
      // Якщо немає покупців, повертаємо нульову статистику
      if (buyers.length === 0) {
        return {
          total: 0,
          bySource: {},
          averageResponseTime: 0
        };
      }

      // Підрахунок статистики
      let totalResponseTime = 0;
      let responseTimeCount = 0;
      
      buyers.forEach(buyer => {
        if (buyer.first_contact_date && buyer.created_at) {
          const responseTime = new Date(buyer.created_at).getTime() - new Date(buyer.first_contact_date).getTime();
          if (responseTime > 0) {
            totalResponseTime += responseTime;
            responseTimeCount++;
          }
        }
      });

      const stats: BuyerStats = {
        total: buyers.length,
        bySource: buyers.reduce((acc: Record<string, number>, buyer) => {
          const source = buyer.source || 'other';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {}),
        averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0
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
    getBuyers,
    getBuyer,
    addBuyer,
    updateBuyer,
    deleteBuyer,
    getBuyerHistory,
    getBuyerStats
  };
};

export default useBuyers;
