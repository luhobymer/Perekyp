import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface ActivityItem {
  id: string;
  type: 'car' | 'expense' | 'mileage' | 'document';
  action: string;
  description: string;
  date: string;
  timestamp: number;
}

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      const allActivities: ActivityItem[] = [];

      // Отримуємо останні додані автомобілі
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('id, brand, model, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (carsError) throw carsError;

      if (cars) {
        cars.forEach(car => {
          allActivities.push({
            id: `car-${car.id}`,
            type: 'car',
            action: 'Додано',
            description: `автомобіль ${car.brand} ${car.model}`,
            date: new Date(car.created_at).toLocaleString('uk-UA', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            timestamp: new Date(car.created_at).getTime()
          });
        });
      }

      // Отримуємо останні витрати
      const { data: expenses, error: expensesError } = await supabase
        .from('car_expenses')
        .select('id, amount, description, date, car_id, cars(brand, model)')
        .order('date', { ascending: false })
        .limit(5);

      if (expensesError) throw expensesError;

      if (expenses) {
        expenses.forEach((expense: any) => {
          const carName = expense.cars ? `${expense.cars.brand} ${expense.cars.model}` : 'автомобіль';
          allActivities.push({
            id: `expense-${expense.id}`,
            type: 'expense',
            action: 'Додано витрату',
            description: `${expense.amount} ₴ на ${carName}`,
            date: new Date(expense.date).toLocaleString('uk-UA', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            timestamp: new Date(expense.date).getTime()
          });
        });
      }

      // Отримуємо останні оновлення пробігу
      const { data: mileageRecords, error: mileageError } = await supabase
        .from('mileage_history')
        .select('id, mileage, date, car_id, cars(brand, model)')
        .order('date', { ascending: false })
        .limit(5);

      if (mileageError) throw mileageError;

      if (mileageRecords) {
        mileageRecords.forEach((record: any) => {
          const carName = record.cars ? `${record.cars.brand} ${record.cars.model}` : 'автомобіль';
          allActivities.push({
            id: `mileage-${record.id}`,
            type: 'mileage',
            action: 'Оновлено пробіг',
            description: `${record.mileage.toLocaleString()} км на ${carName}`,
            date: new Date(record.date).toLocaleString('uk-UA', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            timestamp: new Date(record.date).getTime()
          });
        });
      }

      // Сортуємо всі активності по даті (найновіші спочатку)
      allActivities.sort((a, b) => b.timestamp - a.timestamp);

      // Беремо тільки останні 10
      setActivities(allActivities.slice(0, 10));
      
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError(err instanceof Error ? err.message : 'Помилка завантаження активності');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  return {
    activities,
    loading,
    error,
    refresh: fetchRecentActivity
  };
};
