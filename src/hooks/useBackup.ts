import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Car, Expense, Document, Buyer, Mileage } from '../types';

// Додаткові типи для резервного копіювання
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

export interface BackupRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface BackupData {
  timestamp: string;
  cars: Car[];
  expenses: Expense[];
  services: ServiceRecord[];
  mileage: Mileage[];
  ownership: OwnershipRecord[];
  documents: Document[];
  buyers: Buyer[];
}

export const useBackup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Створення резервної копії
  const createBackup = useCallback(async (userId: string): Promise<BackupRecord> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо всі дані користувача
      const [
        { data: cars, error: carsError },
        { data: expenses, error: expensesError },
        { data: services, error: servicesError },
        { data: mileage, error: mileageError },
        { data: ownership, error: ownershipError },
        { data: documents, error: documentsError },
        { data: buyers, error: buyersError }
      ] = await Promise.all([
        supabase.from('cars').select('*').eq('user_id', userId),
        supabase.from('car_expenses').select('*').eq('user_id', userId),
        supabase.from('service_history').select('*').eq('user_id', userId),
        supabase.from('mileage_history').select('*').eq('user_id', userId),
        supabase.from('ownership_history').select('*').eq('user_id', userId),
        supabase.from('car_documents').select('*').eq('user_id', userId),
        supabase.from('buyers').select('*').eq('user_id', userId)
      ]);

      if (carsError) throw carsError;
      if (expensesError) throw expensesError;
      if (servicesError) throw servicesError;
      if (mileageError) throw mileageError;
      if (ownershipError) throw ownershipError;
      if (documentsError) throw documentsError;
      if (buyersError) throw buyersError;

      // Створюємо об'єкт з даними
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        cars: cars as Car[],
        expenses: expenses as Expense[],
        services: services as ServiceRecord[],
        mileage: mileage as Mileage[],
        ownership: ownership as OwnershipRecord[],
        documents: documents as Document[],
        buyers: buyers as Buyer[]
      };

      // Зберігаємо резервну копію
      const fileName = `backup_${userId}_${Date.now()}.json`;
      const { data, error: uploadError } = await supabase.storage
        .from('backups')
        .upload(fileName, JSON.stringify(backupData), {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Створюємо запис про резервну копію
      const { data: backup, error: backupError } = await supabase
        .from('backups')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_size: JSON.stringify(backupData).length,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (backupError) throw backupError;

      return backup as BackupRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання списку резервних копій
  const getBackups = useCallback(async (userId: string): Promise<BackupRecord[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as BackupRecord[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Відновлення з резервної копії
  const restoreBackup = useCallback(async (backupId: string): Promise<BackupData> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про резервну копію
      const { data: backup, error: backupError } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (backupError) throw backupError;

      // Завантажуємо файл
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('backups')
        .download(backup.file_name);

      if (downloadError) throw downloadError;

      // Парсимо дані
      const text = await fileData.text();
      const backupData = JSON.parse(text) as BackupData;

      // Відновлюємо дані
      const [
        { error: carsError },
        { error: expensesError },
        { error: servicesError },
        { error: mileageError },
        { error: ownershipError },
        { error: documentsError },
        { error: buyersError }
      ] = await Promise.all([
        supabase.from('cars').upsert(backupData.cars),
        supabase.from('car_expenses').upsert(backupData.expenses),
        supabase.from('service_history').upsert(backupData.services),
        supabase.from('mileage_history').upsert(backupData.mileage),
        supabase.from('ownership_history').upsert(backupData.ownership),
        supabase.from('car_documents').upsert(backupData.documents),
        supabase.from('buyers').upsert(backupData.buyers)
      ]);

      if (carsError) throw carsError;
      if (expensesError) throw expensesError;
      if (servicesError) throw servicesError;
      if (mileageError) throw mileageError;
      if (ownershipError) throw ownershipError;
      if (documentsError) throw documentsError;
      if (buyersError) throw buyersError;

      return backupData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення резервної копії
  const deleteBackup = useCallback(async (backupId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про резервну копію
      const { data: backup, error: backupError } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (backupError) throw backupError;

      // Видаляємо файл
      const { error: storageError } = await supabase.storage
        .from('backups')
        .remove([backup.file_name]);

      if (storageError) throw storageError;

      // Видаляємо запис
      const { error: deleteError } = await supabase
        .from('backups')
        .delete()
        .eq('id', backupId);

      if (deleteError) throw deleteError;
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
    createBackup,
    getBackups,
    restoreBackup,
    deleteBackup
  };
};

export default useBackup;
