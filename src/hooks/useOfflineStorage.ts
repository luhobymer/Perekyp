import { useState, useEffect } from 'react';
import { getItem, setItem, removeItem, clear } from '../utils/storage';
import NetInfo from '@react-native-community/netinfo';

// Типи для офлайн-сховища
export interface OfflineStorageItem {
  id: string | number;
  syncStatus: 'pending' | 'synced' | 'error';
  [key: string]: unknown;
}

export type SyncFunction = (item: OfflineStorageItem) => Promise<void>;

export const useOfflineStorage = <T extends OfflineStorageItem>(key: string, initialData: T[] = []) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Перевірка підключення до інтернету
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Завантаження даних з локального сховища
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);
        const storedData = await getItem(key);
        if (storedData) {
          setData(JSON.parse(storedData) as T[]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error(String(err));
        setError(errorMessage);
        console.error('Помилка завантаження даних:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  // Збереження даних в локальне сховище
  const saveData = async (newData: T[]): Promise<void> => {
    try {
      setLoading(true);
      await setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error(String(err));
      setError(errorMessage);
      console.error('Помилка збереження даних:', err);
    } finally {
      setLoading(false);
    }
  };

  // Додавання нового елемента
  const addItem = async (item: Omit<T, 'id' | 'syncStatus'>): Promise<void> => {
    const newItem = {
      ...item,
      id: Date.now(),
      syncStatus: 'pending' as const
    } as unknown as T;
    
    const newData = [...data, newItem];
    await saveData(newData);
  };

  // Оновлення елемента
  const updateItem = async (id: string | number, updates: Partial<T>): Promise<void> => {
    const newData = data.map(item => 
      item.id === id ? { ...item, ...updates, syncStatus: 'pending' as const } : item
    );
    await saveData(newData);
  };

  // Видалення елемента
  const deleteItem = async (id: string | number): Promise<void> => {
    const newData = data.filter(item => item.id !== id);
    await saveData(newData);
  };

  // Синхронізація з сервером
  const syncWithServer = async (syncFunction: SyncFunction): Promise<void> => {
    if (!isOnline) return;

    try {
      setLoading(true);
      const pendingItems = data.filter(item => item.syncStatus === 'pending');
      for (const item of pendingItems) {
        await syncFunction(item);
        await updateItem(item.id, { syncStatus: 'synced' } as Partial<T>);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error(String(err));
      setError(errorMessage);
      console.error('Помилка синхронізації з сервером:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    isOnline,
    addItem,
    updateItem,
    deleteItem,
    syncWithServer,
    saveData
  };
}; 

export default useOfflineStorage;
