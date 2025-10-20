import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { Car, Expense, Mileage } from '../types';

// Додаткові типи для експорту
export interface ServiceRecord {
  id: string;
  car_id: string;
  user_id: string;
  service_type: string;
  service_date: string;
  cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnershipRecord {
  id: string;
  car_id: string;
  user_id: string;
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

export const useExport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Експорт даних про автомобіль в Excel
  const exportCarToExcel = useCallback(async (carId: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      // Отримання даних про автомобіль
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (carError) throw carError;

      // Отримання витрат
      const { data: expenses, error: expensesError } = await supabase
        .from('car_expenses')
        .select('*')
        .eq('car_id', carId);

      if (expensesError) throw expensesError;

      // Отримання історії обслуговування
      const { data: service, error: serviceError } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId);

      if (serviceError) throw serviceError;

      // Отримання історії пробігу
      const { data: mileage, error: mileageError } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId);

      if (mileageError) throw mileageError;

      // Отримання історії власності
      const { data: ownership, error: ownershipError } = await supabase
        .from('ownership_history')
        .select('*')
        .eq('car_id', carId);

      if (ownershipError) throw ownershipError;

      const carData = car as Car;
      const expensesData = expenses as Expense[];
      const serviceData = service as ServiceRecord[];
      const mileageData = mileage as Mileage[];
      const ownershipData = ownership as OwnershipRecord[];

      // Створення робочої книги
      const wb = XLSX.utils.book_new();

      // Додавання інформації про автомобіль
      const carWS = XLSX.utils.json_to_sheet([carData]);
      XLSX.utils.book_append_sheet(wb, carWS, 'Автомобіль');

      // Додавання витрат
      if (expensesData.length > 0) {
        const expensesWS = XLSX.utils.json_to_sheet(expensesData);
        XLSX.utils.book_append_sheet(wb, expensesWS, 'Витрати');
      }

      // Додавання історії обслуговування
      if (serviceData.length > 0) {
        const serviceWS = XLSX.utils.json_to_sheet(serviceData);
        XLSX.utils.book_append_sheet(wb, serviceWS, 'Обслуговування');
      }

      // Додавання історії пробігу
      if (mileageData.length > 0) {
        const mileageWS = XLSX.utils.json_to_sheet(mileageData);
        XLSX.utils.book_append_sheet(wb, mileageWS, 'Пробіг');
      }

      // Додавання історії власності
      if (ownershipData.length > 0) {
        const ownershipWS = XLSX.utils.json_to_sheet(ownershipData);
        XLSX.utils.book_append_sheet(wb, ownershipWS, 'Власність');
      }

      // Збереження файлу
      const fileName = `car_${carId}_${new Date().toISOString()}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      await FileSystem.writeAsStringAsync(filePath, wbout, { encoding: FileSystem.EncodingType.Base64 });

      // Поділитися файлом
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Експорт даних про автомобіль'
      });

      return filePath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Експорт всіх даних користувача
  const exportAllData = useCallback(async (userId: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      // Отримання всіх автомобілів користувача
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId);

      if (carsError) throw carsError;

      const carsData = cars as Car[];

      // Створення робочої книги
      const wb = XLSX.utils.book_new();

      // Додавання списку автомобілів
      const carsWS = XLSX.utils.json_to_sheet(carsData);
      XLSX.utils.book_append_sheet(wb, carsWS, 'Автомобілі');

      // Для кожного автомобіля отримуємо детальну інформацію
      for (const car of carsData) {
        // Отримання витрат
        const { data: expenses } = await supabase
          .from('car_expenses')
          .select('*')
          .eq('car_id', car.id);

        const expensesData = expenses as Expense[];

        if (expensesData?.length > 0) {
          const expensesWS = XLSX.utils.json_to_sheet(expensesData);
          XLSX.utils.book_append_sheet(wb, expensesWS, `Витрати_${car.id}`);
        }

        // Отримання історії обслуговування
        const { data: service } = await supabase
          .from('service_history')
          .select('*')
          .eq('car_id', car.id);

        const serviceData = service as ServiceRecord[];

        if (serviceData?.length > 0) {
          const serviceWS = XLSX.utils.json_to_sheet(serviceData);
          XLSX.utils.book_append_sheet(wb, serviceWS, `Обслуговування_${car.id}`);
        }

        // Отримання історії пробігу
        const { data: mileage } = await supabase
          .from('mileage_history')
          .select('*')
          .eq('car_id', car.id);

        const mileageData = mileage as Mileage[];

        if (mileageData?.length > 0) {
          const mileageWS = XLSX.utils.json_to_sheet(mileageData);
          XLSX.utils.book_append_sheet(wb, mileageWS, `Пробіг_${car.id}`);
        }

        // Отримання історії власності
        const { data: ownership } = await supabase
          .from('ownership_history')
          .select('*')
          .eq('car_id', car.id);

        const ownershipData = ownership as OwnershipRecord[];

        if (ownershipData?.length > 0) {
          const ownershipWS = XLSX.utils.json_to_sheet(ownershipData);
          XLSX.utils.book_append_sheet(wb, ownershipWS, `Власність_${car.id}`);
        }
      }

      // Збереження файлу
      const fileName = `all_data_${userId}_${new Date().toISOString()}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      await FileSystem.writeAsStringAsync(filePath, wbout, { encoding: FileSystem.EncodingType.Base64 });

      // Поділитися файлом
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Експорт всіх даних'
      });

      return filePath;
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
    exportCarToExcel,
    exportAllData
  };
};

export default useExport;
