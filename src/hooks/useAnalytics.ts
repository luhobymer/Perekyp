import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Car, Expense, Mileage } from '../types';

// Додаткові типи для аналітики
export interface ServiceRecord {
  id: string;
  car_id: string;
  service_type: string;
  service_date: string;
  cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CarStats {
  totalCost: number;
  totalServices: number;
  totalExpenses: number;
  averageServiceCost: number;
  averageExpenseCost: number;
  totalMileage: number;
  averageDailyMileage: number;
  expensesByType: Record<string, number>;
  expensesByMonth: Record<string, number>;
  servicesByType: Record<string, number>;
  servicesByMonth: Record<string, number>;
  ownershipDuration: number;
  ownershipProfit: number;
  costPerKm: number;
  costPerDay: number;
  mileageGrowth: number[];
  expenseGrowth: number[];
}

export interface ComparativeStats {
  car1: CarStats;
  car2: CarStats;
  differences: {
    totalCost: number;
    totalServices: number;
    totalExpenses: number;
    averageServiceCost: number;
    averageExpenseCost: number;
    totalMileage: number;
    averageDailyMileage: number;
    costPerKm: number;
    costPerDay: number;
  };
}

export interface ExpenseForecast {
  month: string;
  predictedExpenses: number;
  predictedServices: number;
  total: number;
}

export interface BusinessStats {
  activeCars: number;
  soldCars: number;
  totalInvestment: number;
  totalProfit: number;
  averageROI: number;
  totalBuyers: number;
  monthlyExpenses: {
    labels: string[];
    data: number[];
  };
  monthlyProfits: {
    labels: string[];
    data: number[];
  };
  expensesByCategory: Record<string, number>;
}

export const useAnalytics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання загальної статистики по автомобілю
  const getCarStats = useCallback(async (carId: string): Promise<CarStats> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про автомобіль
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (carError) throw carError;

      // Отримуємо витрати
      const { data: expenses, error: expensesError } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId);

      if (expensesError) throw expensesError;

      // Отримуємо сервісні записи
      const { data: services, error: servicesError } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId);

      if (servicesError) throw servicesError;

      // Отримуємо історію пробігу
      const { data: mileage, error: mileageError } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: true });

      if (mileageError) throw mileageError;

      // Отримуємо історію власності
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('car_id', carId)
        .order('start_date', { ascending: true });

      if (ownershipError) throw ownershipError;

      const carData = car as Car;
      const expensesData = expenses as Expense[];
      const servicesData = services as ServiceRecord[];
      const mileageData = mileage as Mileage[];

      // Розраховуємо статистику
      const stats: CarStats = {
        // Загальна інформація
        totalCost: expensesData.reduce((sum, expense) => sum + expense.amount, 0) +
                  servicesData.reduce((sum, service) => sum + service.cost, 0),
        totalServices: servicesData.length,
        totalExpenses: expensesData.length,
        averageServiceCost: servicesData.length > 0 
          ? servicesData.reduce((sum, service) => sum + service.cost, 0) / servicesData.length 
          : 0,
        averageExpenseCost: expensesData.length > 0 
          ? expensesData.reduce((sum, expense) => sum + expense.amount, 0) / expensesData.length 
          : 0,

        // Статистика по пробігу
        totalMileage: mileageData.length > 0 ? mileageData[mileageData.length - 1]?.value || 0 : 0,
        averageDailyMileage: mileageData.length > 1
          ? mileageData.reduce((acc, record, index) => {
              if (index === 0) return acc;
              const days = (new Date(record.date).getTime() - new Date(mileageData[index - 1].date).getTime()) / (1000 * 60 * 60 * 24);
              if (days <= 0) return acc;
              const mileageDiff = record.value - mileageData[index - 1].value;
              return acc + (mileageDiff / days);
            }, 0) / (mileageData.length - 1)
          : 0,

        // Статистика по витратах
        expensesByType: expensesData.reduce((acc: Record<string, number>, expense) => {
          acc[expense.expense_type] = (acc[expense.expense_type] || 0) + expense.amount;
          return acc;
        }, {}),
        expensesByMonth: expensesData.reduce((acc: Record<string, number>, expense) => {
          const month = new Date(expense.date).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {}),

        // Статистика по сервісу
        servicesByType: servicesData.reduce((acc: Record<string, number>, service) => {
          acc[service.service_type] = (acc[service.service_type] || 0) + service.cost;
          return acc;
        }, {}),
        servicesByMonth: servicesData.reduce((acc: Record<string, number>, service) => {
          const month = new Date(service.service_date).toISOString().slice(0, 7);
          acc[month] = (acc[month] || 0) + service.cost;
          return acc;
        }, {}),

        // Статистика по власності
        ownershipDuration: ownership.reduce((acc, record) => {
          const start = new Date(record.start_date);
          const end = record.end_date ? new Date(record.end_date) : new Date();
          return acc + (end.getTime() - start.getTime());
        }, 0),
        ownershipProfit: ownership.reduce((acc, record) => {
          if (record.sale_price && record.purchase_price) {
            return acc + (record.sale_price - record.purchase_price);
          }
          return acc;
        }, 0),

        // Додаткові метрики
        costPerKm: mileageData.length > 0 && mileageData[mileageData.length - 1]?.value > 0
          ? (expensesData.reduce((sum, expense) => sum + expense.amount, 0) + 
             servicesData.reduce((sum, service) => sum + service.cost, 0)) / 
             mileageData[mileageData.length - 1].value
          : 0,
        costPerDay: ownership.reduce((acc, record) => {
          const start = new Date(record.start_date);
          const end = record.end_date ? new Date(record.end_date) : new Date();
          const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          return days > 0 ? acc + days : acc;
        }, 0) > 0
          ? (expensesData.reduce((sum, expense) => sum + expense.amount, 0) + 
             servicesData.reduce((sum, service) => sum + service.cost, 0)) / 
             (ownership.reduce((acc, record) => {
               const start = new Date(record.start_date);
               const end = record.end_date ? new Date(record.end_date) : new Date();
               const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
               return days > 0 ? acc + days : acc;
             }, 0))
          : 0,

        // Графіки росту
        mileageGrowth: mileageData.map((record, index) => {
          if (index === 0) return 0;
          return record.value - mileageData[index - 1].value;
        }),
        expenseGrowth: Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const month = date.toISOString().slice(0, 7);
          
          return expensesData
            .filter(expense => expense.date.startsWith(month))
            .reduce((sum, expense) => sum + expense.amount, 0);
        }).reverse()
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

  // Порівняння двох автомобілів
  const getComparativeStats = useCallback(async (car1Id: string, car2Id: string): Promise<ComparativeStats> => {
    try {
      setLoading(true);
      setError(null);

      const car1Stats = await getCarStats(car1Id);
      const car2Stats = await getCarStats(car2Id);

      const differences = {
        totalCost: car1Stats.totalCost - car2Stats.totalCost,
        totalServices: car1Stats.totalServices - car2Stats.totalServices,
        totalExpenses: car1Stats.totalExpenses - car2Stats.totalExpenses,
        averageServiceCost: car1Stats.averageServiceCost - car2Stats.averageServiceCost,
        averageExpenseCost: car1Stats.averageExpenseCost - car2Stats.averageExpenseCost,
        totalMileage: car1Stats.totalMileage - car2Stats.totalMileage,
        averageDailyMileage: car1Stats.averageDailyMileage - car2Stats.averageDailyMileage,
        costPerKm: car1Stats.costPerKm - car2Stats.costPerKm,
        costPerDay: car1Stats.costPerDay - car2Stats.costPerDay
      };

      return {
        car1: car1Stats,
        car2: car2Stats,
        differences
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCarStats]);

  // Прогноз витрат
  const getExpenseForecast = useCallback(async (carId: string, months: number = 6): Promise<ExpenseForecast[]> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо історію витрат
      const { data: expenses, error: expensesError } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId);

      if (expensesError) throw expensesError;

      // Отримуємо історію сервісу
      const { data: services, error: servicesError } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId);

      if (servicesError) throw servicesError;

      const expensesData = expenses as Expense[];
      const servicesData = services as ServiceRecord[];

      // Групуємо витрати по місяцях
      const monthlyExpenses = expensesData.reduce((acc: Record<string, number>, expense) => {
        const month = new Date(expense.date).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
      }, {});

      // Групуємо сервіси по місяцях
      const monthlyServices = servicesData.reduce((acc: Record<string, number>, service) => {
        const month = new Date(service.service_date).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + service.cost;
        return acc;
      }, {});

      // Розраховуємо середні витрати
      const monthlyExpensesValues = Object.values(monthlyExpenses) as number[];
      const monthlyServicesValues = Object.values(monthlyServices) as number[];
      
      const averageMonthlyExpense = monthlyExpensesValues.length > 0
        ? monthlyExpensesValues.reduce((sum, amount) => sum + amount, 0) / monthlyExpensesValues.length
        : 0;

      const averageMonthlyService = monthlyServicesValues.length > 0
        ? monthlyServicesValues.reduce((sum, amount) => sum + amount, 0) / monthlyServicesValues.length
        : 0;

      // Створюємо прогноз
      const forecast: ExpenseForecast[] = [];
      const startDate = new Date();
      
      for (let i = 0; i < months; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        forecast.push({
          month: date.toISOString().slice(0, 7),
          predictedExpenses: averageMonthlyExpense,
          predictedServices: averageMonthlyService,
          total: averageMonthlyExpense + averageMonthlyService
        });
      }

      return forecast;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання загальної статистики бізнесу
  const getBusinessStats = useCallback(async (): Promise<BusinessStats> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо всі автомобілі
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('*');

      if (carsError) throw carsError;

      // Отримуємо всі витрати
      const { data: expenses, error: expensesError } = await supabase
        .from('car_expenses')
        .select('*');

      if (expensesError) throw expensesError;

      // Отримуємо всі сервісні записи
      const { data: services, error: servicesError } = await supabase
        .from('service_history')
        .select('*');

      if (servicesError) throw servicesError;

      const carsData = cars as Car[];
      const expensesData = expenses as Expense[];
      const servicesData = services as ServiceRecord[];

      // Розраховуємо статистику
      const activeCars = carsData.filter(car => car.status === 'active').length;
      const soldCars = carsData.filter(car => car.status === 'sold').length;
      const totalInvestment = expensesData.reduce((sum, expense) => sum + expense.amount, 0) +
                            servicesData.reduce((sum, service) => sum + service.cost, 0);

      // Створюємо моковані дані для демонстрації
      return {
        activeCars,
        soldCars,
        totalInvestment,
        totalProfit: 25000, // Моковані дані
        averageROI: 0.15, // Моковані дані
        totalBuyers: 5, // Моковані дані
        monthlyExpenses: {
          labels: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'],
          data: [3000, 5500, 8000, 12000, 16000, 10000],
        },
        monthlyProfits: {
          labels: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'],
          data: [1200, 1800, 2500, 3200, 3800, 2000],
        },
        expensesByCategory: {
          purchase: 45000,
          repair: 3600,
          parts: 2200,
          fuel: 1800,
          insurance: 1500,
          tax: 900,
          other: 500,
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка отримання статистики бізнесу:', err);
      // Повертаємо моковані дані у випадку помилки
      return {
        activeCars: 0,
        soldCars: 0,
        totalInvestment: 0,
        totalProfit: 0,
        averageROI: 0,
        totalBuyers: 0,
        monthlyExpenses: {
          labels: [],
          data: [],
        },
        monthlyProfits: {
          labels: [],
          data: [],
        },
        expensesByCategory: {}
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getCarStats,
    getComparativeStats,
    getExpenseForecast,
    getBusinessStats
  };
};

export default useAnalytics;
