import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

// Типи для сервісних записів
export interface ServiceRecord {
  id: string;
  car_id: string;
  service_type: string;
  service_date: string;
  mileage?: number;
  cost?: number;
  description?: string;
  service_provider?: string;
  parts_replaced?: string[];
  next_service_date?: string;
  next_service_mileage?: number;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceRecordWithCar extends ServiceRecord {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface ServiceStats {
  total_cost: number;
  service_count: number;
  by_type: Record<string, number>;
  by_month: Record<string, number>;
  average_cost_per_service: number;
  most_expensive_service?: ServiceRecord;
  most_recent_service?: ServiceRecord;
  next_service?: {
    date?: string;
    mileage?: number;
    service_type?: string;
  };
}

export interface DocumentFile {
  uri: string;
  name: string;
  mimeType?: string;
  type?: string;
}

export const useService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання списку сервісних записів
  const getServiceHistory = useCallback(async (carId: string): Promise<ServiceRecordWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
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
        .order('service_date', { ascending: false });

      if (error) throw error;

      return data as ServiceRecordWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання сервісного запису
  const getServiceRecord = useCallback(async (recordId: string): Promise<ServiceRecord> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;

      return data as ServiceRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання сервісного запису
  const addServiceRecord = useCallback(async (carId: string, record: Partial<ServiceRecord>): Promise<ServiceRecord> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
        .insert({
          car_id: carId,
          service_type: record.service_type,
          service_date: record.service_date,
          mileage: record.mileage,
          cost: record.cost,
          description: record.description,
          service_provider: record.service_provider,
          parts_replaced: record.parts_replaced,
          next_service_date: record.next_service_date,
          next_service_mileage: record.next_service_mileage,
          notes: record.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as ServiceRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення сервісного запису
  const updateServiceRecord = useCallback(async (recordId: string, updates: Partial<ServiceRecord>): Promise<ServiceRecord> => {
    try {
      setLoading(true);
      setError(null);

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('service_history')
        .update(updatesWithTimestamp)
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;

      return data as ServiceRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення сервісного запису
  const deleteServiceRecord = useCallback(async (recordId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('service_history')
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

  // Отримання статистики сервісних операцій
  const getServiceStats = useCallback(async (carId: string): Promise<ServiceStats> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId);

      if (error) throw error;

      const serviceRecords = data as ServiceRecord[];
      
      // Розрахунок статистики
      const totalCost = serviceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
      
      const byType: Record<string, number> = {};
      serviceRecords.forEach(record => {
        byType[record.service_type] = (byType[record.service_type] || 0) + (record.cost || 0);
      });
      
      const byMonth: Record<string, number> = {};
      serviceRecords.forEach(record => {
        const month = record.service_date.substring(0, 7); // YYYY-MM
        byMonth[month] = (byMonth[month] || 0) + (record.cost || 0);
      });
      
      const sortedByDate = [...serviceRecords].sort(
        (a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
      );
      
      const sortedByCost = [...serviceRecords].sort(
        (a, b) => (b.cost || 0) - (a.cost || 0)
      );
      
      // Знаходимо наступний запланований сервіс
      const today = new Date();
      const upcomingServices = serviceRecords.filter(
        record => record.next_service_date && new Date(record.next_service_date) > today
      ).sort((a, b) => 
        new Date(a.next_service_date!).getTime() - new Date(b.next_service_date!).getTime()
      );
      
      const stats: ServiceStats = {
        total_cost: totalCost,
        service_count: serviceRecords.length,
        by_type: byType,
        by_month: byMonth,
        average_cost_per_service: serviceRecords.length ? totalCost / serviceRecords.length : 0,
        most_expensive_service: sortedByCost.length ? sortedByCost[0] : undefined,
        most_recent_service: sortedByDate.length ? sortedByDate[0] : undefined,
        next_service: upcomingServices.length ? {
          date: upcomingServices[0].next_service_date,
          mileage: upcomingServices[0].next_service_mileage,
          service_type: upcomingServices[0].service_type
        } : undefined
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

  // Отримання історії сервісу за період
  const getServiceHistoryByPeriod = useCallback(async (
    carId: string, 
    startDate: string, 
    endDate: string
  ): Promise<ServiceRecord[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId)
        .gte('service_date', startDate)
        .lte('service_date', endDate)
        .order('service_date', { ascending: false });

      if (error) throw error;

      return data as ServiceRecord[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання історії сервісу за типом
  const getServiceHistoryByType = useCallback(async (
    carId: string, 
    serviceType: string
  ): Promise<ServiceRecord[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId)
        .eq('service_type', serviceType)
        .order('service_date', { ascending: false });

      if (error) throw error;

      return data as ServiceRecord[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання інформації про наступний сервіс
  const getNextService = useCallback(async (carId: string): Promise<ServiceRecord | null> => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('car_id', carId)
        .gt('next_service_date', today)
        .order('next_service_date', { ascending: true })
        .limit(1);

      if (error) throw error;

      return data.length > 0 ? data[0] as ServiceRecord : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантаження документа
  const uploadDocument = useCallback(async (
    recordId: string, 
    file: DocumentFile
  ): Promise<ServiceRecord> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про запис
      const { data: record, error: recordError } = await supabase
        .from('service_history')
        .select('*')
        .eq('id', recordId)
        .single();

      if (recordError) throw recordError;

      // Завантажуємо файл в Supabase Storage
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${(record as ServiceRecord).car_id}/${recordId}_${Date.now()}.${fileExt}`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Копіюємо файл в локальну директорію
      await FileSystem.copyAsync({
        from: file.uri,
        to: filePath
      });

      // Завантажуємо файл в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service_documents')
        .upload(fileName, {
          uri: filePath,
          type: file.mimeType || 'application/octet-stream',
          name: file.name
        });

      if (uploadError) throw uploadError;

      // Отримуємо публічний URL
      const { data: { publicUrl } } = supabase.storage
        .from('service_documents')
        .getPublicUrl(fileName);

      // Оновлюємо запис
      const documents = [...((record as ServiceRecord).documents || []), publicUrl];
      const { data, error } = await supabase
        .from('service_history')
        .update({ 
          documents,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;

      // Видаляємо локальну копію
      await FileSystem.deleteAsync(filePath);

      return data as ServiceRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення документа
  const deleteDocument = useCallback(async (
    recordId: string, 
    documentUrl: string
  ): Promise<ServiceRecord> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про запис
      const { data: record, error: recordError } = await supabase
        .from('service_history')
        .select('*')
        .eq('id', recordId)
        .single();

      if (recordError) throw recordError;

      // Видаляємо файл з Supabase Storage
      const fileName = documentUrl.split('/').pop() || '';
      const { error: storageError } = await supabase.storage
        .from('service_documents')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Оновлюємо запис
      const documents = (record as ServiceRecord).documents?.filter(doc => doc !== documentUrl) || [];
      const { data, error } = await supabase
        .from('service_history')
        .update({ 
          documents,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;

      return data as ServiceRecord;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Вибір документа
  const pickDocument = useCallback(async (): Promise<DocumentFile | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        return {
          uri: result.uri,
          name: result.name,
          mimeType: result.mimeType
        };
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Відкриття документа
  const openDocument = useCallback(async (documentUrl: string): Promise<void> => {
    try {
      await Sharing.shareAsync(documentUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    getServiceHistory,
    getServiceRecord,
    addServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
    getServiceStats,
    getServiceHistoryByPeriod,
    getServiceHistoryByType,
    getNextService,
    uploadDocument,
    deleteDocument,
    pickDocument,
    openDocument
  };
};

export default useService;
