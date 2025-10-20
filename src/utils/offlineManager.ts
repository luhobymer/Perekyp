import { getItem, setItem, removeItem, clear } from './storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

// Інтерфейси для типів
type PendingOperation = {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount?: number;
};

type OfflineData = {
  [key: string]: any[];
};

type OfflineStore = {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number | null;
  pendingOperations: PendingOperation[];
  setOnlineStatus: (status: boolean) => void;
  addPendingOperation: (operation: PendingOperation) => void;
  removePendingOperation: (operationId: string) => void;
  setLastSync: (timestamp: number) => void;
  setSyncing: (status: boolean) => void;
};

// Перевіряємо, чи виконується код на сервері
const isServer: boolean = typeof window === 'undefined';

// Ключі для зберігання даних
const OFFLINE_STORAGE_KEYS = {
  CARS: '@offline_cars',
  EXPENSES: '@offline_expenses',
  DOCUMENTS: '@offline_documents',
  PENDING_OPERATIONS: '@pending_operations',
  LAST_SYNC: '@last_sync',
} as const;

// Створюємо сховище для управління офлайн станом
const offlineStore = createStore<OfflineStore>((set) => ({
  isOnline: true,
  isSyncing: false,
  lastSync: null,
  pendingOperations: [],
  
  // Оновлення стану підключення
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  
  // Додавання операції до черги
  addPendingOperation: (operation: PendingOperation) => 
    set((state) => ({
      pendingOperations: [...state.pendingOperations, operation],
    })),
    
  // Видалення операції з черги
  removePendingOperation: (operationId: string) =>
    set((state) => ({
      pendingOperations: state.pendingOperations.filter(
        (op) => op.id !== operationId
      ),
    })),
    
  // Оновлення часу останньої синхронізації
  setLastSync: (timestamp: number) => set({ lastSync: timestamp }),
  
  // Встановлення стану синхронізації
  setSyncing: (status: boolean) => set({ isSyncing: status }),
}));

// Створюємо хук для використання сховища в компонентах
export const useOfflineStore = <T>(selector: (state: OfflineStore) => T) => 
  useStore<OfflineStore, T>(offlineStore, selector);

// Клас для управління офлайн даними
class OfflineManager {
  private netInfoUnsubscribe: (() => void) | null = null;
  private data: OfflineData = {};
  
  // Ініціалізація менеджера
  async initialize(): Promise<void> {
    if (isServer) return;
    
    try {
      // Підписуємося на зміни стану мережі
      this.netInfoUnsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
        offlineStore.getState().setOnlineStatus(!!state.isConnected);
      });
      
      await this.loadOfflineData();
    } catch (error) {
      console.error('Помилка ініціалізації OfflineManager:', error);
    }
  }

  // Завантаження офлайн даних
  private async loadOfflineData(): Promise<void> {
    if (isServer) return;
    
    try {
      const data = await getItem('offlineData');
      this.data = data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Помилка завантаження офлайн даних:', error);
      this.data = {};
    }
  }

  // Збереження даних офлайн
  private async saveOfflineData(): Promise<void> {
    if (isServer) return;
    
    try {
      await setItem('offlineData', JSON.stringify(this.data));
    } catch (error) {
      console.error('Помилка збереження офлайн даних:', error);
    }
  }

  // Додавання елемента до офлайн сховища
  async addItem<T extends { id: string }>(
    key: string, 
    item: T
  ): Promise<void> {
    if (isServer) return;
    
    if (!this.data[key]) {
      this.data[key] = [];
    }
    this.data[key].push(item);
    await this.saveOfflineData();
  }

  // Оновлення елемента в офлайн сховищі
  async updateItem<T extends { id: string }>(
    key: string, 
    id: string, 
    updates: Partial<T>
  ): Promise<boolean> {
    if (isServer) return false;
    
    if (this.data[key]) {
      const index = this.data[key].findIndex((item: T) => item.id === id);
      if (index !== -1) {
        this.data[key][index] = { ...this.data[key][index], ...updates };
        await this.saveOfflineData();
        return true;
      }
    }
    return false;
  }

  // Видалення елемента з офлайн сховища
  async deleteItem(key: string, id: string): Promise<boolean> {
    if (isServer) return false;
    
    if (this.data[key]) {
      const initialLength = this.data[key].length;
      this.data[key] = this.data[key].filter((item: { id: string }) => item.id !== id);
      
      if (this.data[key].length !== initialLength) {
        await this.saveOfflineData();
        return true;
      }
    }
    return false;
  }
  
  // Отримання елементів за ключем
  getItems<T>(key: string): T[] {
    return (this.data[key] as T[]) || [];
  }
  
  // Отримання елемента за ID
  getItemById<T extends { id: string }>(key: string, id: string): T | undefined {
    if (!this.data[key]) return undefined;
    return this.data[key].find((item: T) => item.id === id) as T | undefined;
  }
  
  // Очищення даних
  async clearData(): Promise<void> {
    if (isServer) return;
    
    try {
      await clear();
      this.data = {};
    } catch (error) {
      console.error('Помилка очищення офлайн даних:', error);
    }
  }

  // Очищення ресурсів
  cleanup(): void {
    if (isServer) return;
    
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }
  }
  
  // Перевірка підключення до мережі
  isOnline(): boolean {
    return offlineStore.getState().isOnline;
  }
  
  // Отримання стану синхронізації
  isSyncing(): boolean {
    return offlineStore.getState().isSyncing;
  }
  
  // Запуск синхронізації
  async sync(): Promise<void> {
    if (isServer || !this.isOnline() || this.isSyncing()) return;
    
    const { setSyncing, pendingOperations } = offlineStore.getState();
    
    if (pendingOperations.length === 0) return;
    
    setSyncing(true);
    
    try {
      // Тут буде логіка синхронізації з сервером
      // Наприклад, відправка операцій на сервер
      
      // Після успішної синхронізації оновлюємо стан
      offlineStore.getState().setLastSync(Date.now());
      offlineStore.getState().setSyncing(false);
    } catch (error) {
      console.error('Помилка синхронізації:', error);
      offlineStore.getState().setSyncing(false);
    }
  }
}

// Експортуємо єдиний екземпляр менеджера
const offlineManager = new OfflineManager();

export default offlineManager;
