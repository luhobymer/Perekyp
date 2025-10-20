import AsyncStorage from '@react-native-async-storage/async-storage';

// Інтерфейс для сховища
interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Перевіряємо, чи виконується код на сервері (SSR)
const isServer: boolean = typeof window === 'undefined';

// Перевіряємо, чи виконується код у браузері
const isBrowser: boolean = !isServer && typeof window.localStorage !== 'undefined';

// Порожня реалізація для сервера
const noopStorage: IStorage = {
  getItem: async (): Promise<null> => null,
  setItem: async (): Promise<void> => {},
  removeItem: async (): Promise<void> => {},
  clear: async (): Promise<void> => {}
};

// Веб-реалізація для браузера
const webStorage: IStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Помилка отримання даних з localStorage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Помилка збереження даних в localStorage:', error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Помилка видалення даних з localStorage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Помилка очищення localStorage:', error);
    }
  }
};

// Безпечна реалізація для AsyncStorage
const safeAsyncStorage: IStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Помилка отримання даних з AsyncStorage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Помилка збереження даних в AsyncStorage:', error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Помилка видалення даних з AsyncStorage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Помилка очищення AsyncStorage:', error);
    }
  }
};

// Вибір реалізації сховища в залежності від середовища
const storageImplementation: IStorage = isServer 
  ? noopStorage 
  : (isBrowser ? webStorage : safeAsyncStorage);

// Експорт звичайних функцій для використання в додатку
export const getItem = storageImplementation.getItem;
export const setItem = storageImplementation.setItem;
export const removeItem = storageImplementation.removeItem;
export const clear = storageImplementation.clear;

// Додаткова реалізація для API Supabase
export const storageAdapter = {
  getItem: storageImplementation.getItem,
  setItem: storageImplementation.setItem,
  removeItem: storageImplementation.removeItem
} as const;

// Додаткові утиліти для роботи з JSON
export const storage = {
  // Отримання об'єкта зі сховища
  getObject: async <T>(key: string, defaultValue: T | null = null): Promise<T | null> => {
    try {
      const item = await storageImplementation.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Помилка отримання об'єкта ${key} зі сховища:`, error);
      return defaultValue;
    }
  },
  
  // Збереження об'єкта у сховище
  setObject: async <T>(key: string, value: T): Promise<void> => {
    try {
      await storageImplementation.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Помилка збереження об'єкта ${key} у сховище:`, error);
    }
  },
  
  // Видалення ключа зі сховища
  remove: async (key: string): Promise<void> => {
    try {
      await storageImplementation.removeItem(key);
    } catch (error) {
      console.error(`Помилка видалення ключа ${key} зі сховища:`, error);
    }
  },
  
  // Очищення всього сховища
  clearAll: async (): Promise<void> => {
    try {
      await storageImplementation.clear();
    } catch (error) {
      console.error('Помилка очищення сховища:', error);
    }
  },
  
  // Отримання всіх ключів
  getAllKeys: async (): Promise<string[]> => {
    if (isServer) return [];
    
    try {
      if (isBrowser) {
        return Object.keys(window.localStorage);
      } else {
        return await AsyncStorage.getAllKeys();
      }
    } catch (error) {
      console.error('Помилка отримання ключів сховища:', error);
      return [];
    }
  },
  
  // Перевірка наявності ключа
  hasKey: async (key: string): Promise<boolean> => {
    try {
      const keys = await storage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Помилка перевірки наявності ключа:', error);
      return false;
    }
  }
} as const;

export default storage;
