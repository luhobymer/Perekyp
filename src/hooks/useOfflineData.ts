import { useEffect, useState } from 'react';
import { useOfflineStore } from '../utils/offlineManager';
import { offlineManager } from '../utils/offlineManager';

// Типи для офлайн-даних
export interface OfflineItem {
  id: string;
  [key: string]: unknown;
}

export interface OfflineOperation {
  type: string;
  data: Record<string, unknown>;
  id?: string;
}

export const useOfflineData = <T extends OfflineItem>(dataType: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { isOnline, isSyncing } = useOfflineStore();

  useEffect(() => {
    loadData();
  }, [dataType]);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const offlineData = await offlineManager.loadOfflineData();
      setData((offlineData[dataType] || []) as T[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: T[]): Promise<void> => {
    try {
      await offlineManager.saveOfflineData(
        `@offline_${dataType}`,
        newData
      );
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const addItem = async (item: T): Promise<T> => {
    try {
      const newData = [...data, item];
      await saveData(newData);
      
      // Додаємо операцію до черги
      await offlineManager.addOperation({
        type: `CREATE_${dataType.toUpperCase()}`,
        data: item,
      });
      
      return item;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>): Promise<T | undefined> => {
    try {
      const newData = data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      await saveData(newData);
      
      // Додаємо операцію до черги
      await offlineManager.addOperation({
        type: `UPDATE_${dataType.toUpperCase()}`,
        data: { id, updates },
      });
      
      return newData.find(item => item.id === id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      const newData = data.filter(item => item.id !== id);
      await saveData(newData);
      
      // Додаємо операцію до черги
      await offlineManager.addOperation({
        type: `DELETE_${dataType.toUpperCase()}`,
        data: { id },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    isOnline,
    isSyncing,
    addItem,
    updateItem,
    deleteItem,
    refresh: loadData,
  };
}; 

export default useOfflineData;
