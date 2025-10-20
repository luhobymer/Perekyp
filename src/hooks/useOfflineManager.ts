import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
// @ts-ignore - Вимикаємо перевірку типів для uuid, оскільки немає файлу декларації типів
import { v4 as uuidv4 } from 'uuid';

// Типи для офлайн-менеджера
export interface OfflineOperation {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  dataType: string;
}

export interface OfflineItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  _syncStatus: 'pending' | 'synced' | 'error';
  [key: string]: unknown;
}

export interface OfflineSyncResult {
  updatedData?: OfflineItem[];
  [key: string]: unknown;
}

export interface OfflineManagerOptions {
  onlineSync?: (operations: OfflineOperation[], data: OfflineItem[]) => Promise<OfflineSyncResult>;
  handleOperation?: (operation: OfflineOperation) => Promise<unknown>;
}

export interface OfflineStoreState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  pendingOperations: OfflineOperation[];
  setOnlineStatus: (status: boolean) => void;
  setSyncing: (status: boolean) => void;
  setLastSync: (timestamp: string | null) => void;
  setPendingOperations: (operations: OfflineOperation[]) => void;
  addPendingOperation: (operation: OfflineOperation) => void;
  removePendingOperation: (operationId: string) => void;
}

// Префікс для ключів сховища
const STORAGE_PREFIX = '@offline_';

// Ключі для зберігання
const STORAGE_KEYS = {
  PENDING_OPERATIONS: `${STORAGE_PREFIX}pending_operations`,
  LAST_SYNC: `${STORAGE_PREFIX}last_sync`,
};

// Глобальне сховище стану офлайн-режиму
// Створюємо сховище
const offlineStore = createStore<OfflineStoreState>((set) => ({
  isOnline: true,
  isSyncing: false,
  lastSync: null,
  pendingOperations: [],
  
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  
  setSyncing: (status: boolean) => set({ isSyncing: status }),
  
  setLastSync: (timestamp: string | null) => set({ lastSync: timestamp }),
  
  setPendingOperations: (operations: OfflineOperation[]) => set({ pendingOperations: operations }),
  
  addPendingOperation: (operation: OfflineOperation) => set((state) => ({
    pendingOperations: [...state.pendingOperations, operation]
  })),
  
  removePendingOperation: (operationId: string) => set((state) => ({
    pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
  }))
}));

// Створюємо хук для використання сховища в компонентах
export const useOfflineStore = <T>(selector: (state: OfflineStoreState) => T): T => 
  useStore(offlineStore, selector);

/**
 * Універсальний гук для управління офлайн-даними
 * @param dataType - Тип даних (cars, expenses, тощо)
 * @param options - Налаштування
 * @returns - Методи для роботи з офлайн-даними
 */
export const useOfflineManager = (dataType: string, options: OfflineManagerOptions = {}) => {
  const [data, setData] = useState<OfflineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    isOnline, 
    isSyncing, 
    pendingOperations,
    addPendingOperation,
    removePendingOperation,
    setOnlineStatus,
    setSyncing,
    setLastSync,
    setPendingOperations 
  } = useOfflineStore((state: OfflineStoreState) => state);
  
  const storageKey = `${STORAGE_PREFIX}${dataType}`;
  
  // Ініціалізація та прослуховування стану мережі
  useEffect(() => {
    loadData();
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setOnlineStatus(state.isConnected ?? false);
      if (state.isConnected && pendingOperations.length > 0) {
        syncWithServer();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [dataType]);
  
  // Завантаження даних зі сховища
  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Завантажуємо дані поточного типу
      const storedData = await AsyncStorage.getItem(storageKey);
      const parsedData: OfflineItem[] = storedData ? JSON.parse(storedData) : [];
      setData(parsedData);
      
      // Завантажуємо черги операцій
      const storedOperations = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_OPERATIONS);
      const operations: OfflineOperation[] = storedOperations ? JSON.parse(storedOperations) : [];
      setPendingOperations(operations);
      
      // Час останньої синхронізації
      const storedLastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      setLastSync(storedLastSync ? JSON.parse(storedLastSync) : null);
      
    } catch (err) {
      console.error('Помилка завантаження даних:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  // Збереження даних у сховище
  const saveData = async (newData: OfflineItem[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error('Помилка збереження даних:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Додавання нової операції до черги
  const addOperation = async (type: string, operationData: Record<string, unknown>): Promise<OfflineOperation> => {
    try {
      const operation: OfflineOperation = {
        id: uuidv4(),
        type,
        data: operationData,
        timestamp: new Date().toISOString(),
        dataType
      };
      
      addPendingOperation(operation);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_OPERATIONS, 
        JSON.stringify([...pendingOperations, operation])
      );
      
      return operation;
    } catch (err) {
      console.error('Помилка додавання операції:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Додавання елемента
  const addItem = async (item: Partial<OfflineItem>): Promise<OfflineItem> => {
    try {
      const newItem: OfflineItem = { 
        ...item as OfflineItem, 
        id: item.id || uuidv4(),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _syncStatus: 'pending'
      };
      
      const newData = [...data, newItem];
      await saveData(newData);
      
      await addOperation(`CREATE_${dataType.toUpperCase()}`, newItem);
      
      if (isOnline) {
        syncWithServer();
      }
      
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Оновлення елемента
  const updateItem = async (id: string, updates: Partial<OfflineItem>): Promise<OfflineItem> => {
    try {
      const item = data.find(item => item.id === id);
      
      if (!item) {
        throw new Error(`Елемент з ID ${id} не знайдено`);
      }
      
      const updatedItem: OfflineItem = { 
        ...item, 
        ...updates, 
        updatedAt: new Date().toISOString(),
        _syncStatus: 'pending'
      };
      
      const newData = data.map(item => item.id === id ? updatedItem : item);
      await saveData(newData);
      
      await addOperation(`UPDATE_${dataType.toUpperCase()}`, { id, updates: updatedItem });
      
      if (isOnline) {
        syncWithServer();
      }
      
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Видалення елемента
  const deleteItem = async (id: string): Promise<void> => {
    try {
      const itemExists = data.some(item => item.id === id);
      
      if (!itemExists) {
        throw new Error(`Елемент з ID ${id} не знайдено`);
      }
      
      const newData = data.filter(item => item.id !== id);
      await saveData(newData);
      
      await addOperation(`DELETE_${dataType.toUpperCase()}`, { id });
      
      if (isOnline) {
        syncWithServer();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
  
  // Синхронізація з сервером
  const syncWithServer = async (): Promise<void> => {
    if (!isOnline || isSyncing || !options.onlineSync) return;
    
    try {
      setSyncing(true);
      
      // Отримуємо операції для поточного типу даних
      const operationsToSync = pendingOperations.filter((op: OfflineOperation) => op.dataType === dataType);
      
      if (operationsToSync.length === 0) {
        return;
      }
      
      // Викликаємо функцію синхронізації
      const syncResult = await options.onlineSync(operationsToSync, data);
      
      // Оновлюємо дані після синхронізації
      if (syncResult && syncResult.updatedData) {
        await saveData(syncResult.updatedData);
      }
      
      // Видаляємо виконані операції
      const completedIds = operationsToSync.map((op: OfflineOperation) => op.id);
      const updatedOperations = pendingOperations.filter((op: OfflineOperation) => !completedIds.includes(op.id));
      
      setPendingOperations(updatedOperations);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_OPERATIONS, JSON.stringify(updatedOperations));
      
      // Оновлюємо час останньої синхронізації
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(now));
      setLastSync(now);
      
    } catch (err) {
      console.error('Помилка синхронізації з сервером:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSyncing(false);
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
    sync: syncWithServer,
    pendingOperations: pendingOperations.filter((op: OfflineOperation) => op.dataType === dataType),
  };
};
