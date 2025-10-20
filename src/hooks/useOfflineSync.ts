import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

// Типи для офлайн-синхронізації
export interface SyncOperation {
  id: string;
  entityName: string;
  type: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: string;
  [key: string]: unknown;
}

export interface OfflineSyncOptions {
  fetchServerData?: () => Promise<unknown[]>;
  syncLocalData?: (queue: SyncOperation[], serverData: unknown[]) => Promise<void>;
  entityName: string;
  syncInterval?: number;
}

// Ключі для збереження інформації про синхронізацію
const SYNC_QUEUE_KEY = '@offline_sync_queue';
const LAST_SYNC_KEY = '@offline_last_sync';

/**
 * Хук для синхронізації даних між локальним сховищем та сервером
 * @param options - Опції синхронізації
 * @param options.fetchServerData - Функція для отримання даних з сервера
 * @param options.syncLocalData - Функція для синхронізації локальних даних з сервером
 * @param options.entityName - Назва сутності для синхронізації (cars, expenses, тощо)
 * @param options.syncInterval - Інтервал автоматичної синхронізації в мс (за замовчуванням 5 хвилин)
 */
export const useOfflineSync = (options: OfflineSyncOptions) => {
  const { 
    fetchServerData, 
    syncLocalData, 
    entityName, 
    syncInterval = 5 * 60 * 1000 // 5 хвилин за замовчуванням
  } = options;
  
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncQueue, setSyncQueue] = useState<SyncOperation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Завантаження стану синхронізації
  useEffect(() => {
    const loadSyncState = async (): Promise<void> => {
      try {
        // Завантажуємо чергу синхронізації
        const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
        if (queueData) {
          const queue = JSON.parse(queueData) as SyncOperation[];
          setSyncQueue(queue.filter(item => item.entityName === entityName));
        }
        
        // Завантажуємо час останньої синхронізації
        const lastSyncData = await AsyncStorage.getItem(LAST_SYNC_KEY);
        if (lastSyncData) {
          setLastSync(JSON.parse(lastSyncData));
        }
      } catch (err) {
        console.error('Помилка завантаження стану синхронізації:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };
    
    loadSyncState();
  }, [entityName]);
  
  // Моніторинг підключення до мережі
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected ?? false;
      setIsOnline(isConnected);
      
      // Автоматична синхронізація при відновленні підключення
      if (isConnected && syncQueue.length > 0) {
        synchronize();
      }
    });
    
    return () => unsubscribe();
  }, [syncQueue]);
  
  // Автоматична синхронізація за інтервалом
  useEffect(() => {
    let syncTimer: NodeJS.Timeout | undefined;
    
    if (isOnline && syncInterval > 0) {
      syncTimer = setInterval(() => {
        synchronize();
      }, syncInterval);
    }
    
    return () => {
      if (syncTimer) {
        clearInterval(syncTimer);
      }
    };
  }, [isOnline, syncInterval]);
  
  // Додавання операції в чергу синхронізації
  const addToSyncQueue = async (operation: Partial<SyncOperation>): Promise<SyncOperation> => {
    try {
      const newOperation: SyncOperation = {
        ...operation as SyncOperation,
        entityName,
        timestamp: new Date().toISOString(),
        id: operation.id || Date.now().toString()
      };
      
      const updatedQueue = [...syncQueue, newOperation];
      setSyncQueue(updatedQueue);
      
      // Зберігаємо оновлену чергу
      const allQueueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      const allQueue = allQueueData ? JSON.parse(allQueueData) as SyncOperation[] : [];
      const updatedAllQueue = [
        ...allQueue.filter(item => item.entityName !== entityName || 
                             syncQueue.some(sq => sq.id === item.id)),
        newOperation
      ];
      
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedAllQueue));
      
      // Запускаємо синхронізацію, якщо є підключення
      if (isOnline) {
        synchronize();
      }
      
      return newOperation;
    } catch (err) {
      console.error('Помилка додавання операції в чергу синхронізації:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Видалення операції з черги
  const removeFromSyncQueue = async (operationId: string): Promise<void> => {
    try {
      const updatedQueue = syncQueue.filter(op => op.id !== operationId);
      setSyncQueue(updatedQueue);
      
      // Оновлюємо збережену чергу
      const allQueueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      const allQueue = allQueueData ? JSON.parse(allQueueData) as SyncOperation[] : [];
      const updatedAllQueue = allQueue.filter(op => op.id !== operationId);
      
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedAllQueue));
    } catch (err) {
      console.error('Помилка видалення операції з черги:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  // Синхронізація з сервером
  const synchronize = async (): Promise<void> => {
    if (!isOnline || isSyncing || syncQueue.length === 0) {
      return;
    }
    
    try {
      setIsSyncing(true);
      
      // Перевіряємо, чи є підключення до сервера
      const { error: connectionError } = await supabase.from(entityName).select('count');
      if (connectionError) {
        throw new Error(`Неможливо підключитися до серверу: ${connectionError.message}`);
      }
      
      // Отримуємо дані з сервера
      let serverData: unknown[] = [];
      if (fetchServerData) {
        serverData = await fetchServerData();
      }
      
      // Синхронізуємо локальні зміни з сервером
      if (syncLocalData) {
        await syncLocalData(syncQueue, serverData);
      }
      
      // Очищаємо чергу після успішної синхронізації
      setSyncQueue([]);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
      
      // Оновлюємо час останньої синхронізації
      const now = new Date().toISOString();
      setLastSync(now);
      await AsyncStorage.setItem(LAST_SYNC_KEY, JSON.stringify(now));
      
    } catch (err) {
      console.error('Помилка синхронізації з сервером:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSyncing(false);
    }
  };
  
  return {
    isOnline,
    isSyncing,
    lastSync,
    syncQueue,
    error,
    synchronize,
    addToSyncQueue,
    removeFromSyncQueue
  };
}; 

export default useOfflineSync;
