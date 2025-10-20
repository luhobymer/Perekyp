import { create } from 'zustand';
import { Car } from '../types/cars';
import { supabase } from '../services/supabase';

/**
 * Інтерфейс стану автомобілів
 */
interface CarsState {
  cars: Car[];
  filteredCars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  filter: {
    status?: 'available' | 'sold' | 'reserved' | 'maintenance';
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
  };
}

/**
 * Інтерфейс дій для автомобілів
 */
interface CarsActions {
  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<Car | null>;
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Car | null>;
  updateCar: (id: string, data: Partial<Car>) => Promise<Car | null>;
  deleteCar: (id: string) => Promise<boolean>;
  selectCar: (car: Car | null) => void;
  setFilter: (filter: CarsState['filter']) => void;
  applyFilter: () => void;
  clearFilter: () => void;
  clearError: () => void;
}

/**
 * Стор для управління автомобілями
 */
const useCarsStore = create<CarsState & CarsActions>((set, get) => ({
  // Початковий стан
  cars: [],
  filteredCars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
  filter: {},

  /**
   * Отримання списку автомобілів
   */
  fetchCars: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        cars: data as Car[], 
        filteredCars: data as Car[],
        isLoading: false 
      });
      
      // Застосовуємо поточний фільтр
      get().applyFilter();
    } catch (error: any) {
      console.error('Помилка отримання автомобілів:', error.message);
      set({ 
        error: error.message || 'Помилка отримання автомобілів', 
        isLoading: false 
      });
    }
  },

  /**
   * Отримання автомобіля за ID
   * @param id - ID автомобіля
   */
  fetchCarById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ 
        selectedCar: data as Car,
        isLoading: false 
      });
      
      return data as Car;
    } catch (error: any) {
      console.error('Помилка отримання автомобіля:', error.message);
      set({ 
        error: error.message || 'Помилка отримання автомобіля', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Додавання нового автомобіля
   * @param car - дані автомобіля
   */
  addCar: async (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('cars')
        .insert([
          { 
            ...car, 
            createdAt: now, 
            updatedAt: now 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Оновлюємо список автомобілів
      const newCar = data as Car;
      const cars = [newCar, ...get().cars];
      
      set({ 
        cars,
        filteredCars: cars,
        isLoading: false 
      });
      
      // Застосовуємо поточний фільтр
      get().applyFilter();
      
      return newCar;
    } catch (error: any) {
      console.error('Помилка додавання автомобіля:', error.message);
      set({ 
        error: error.message || 'Помилка додавання автомобіля', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Оновлення автомобіля
   * @param id - ID автомобіля
   * @param data - дані для оновлення
   */
  updateCar: async (id: string, data: Partial<Car>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: updatedData, error } = await supabase
        .from('cars')
        .update({ 
          ...data, 
          updatedAt: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedCar = updatedData as Car;
      
      // Оновлюємо список автомобілів
      const cars = get().cars.map(car => 
        car.id === id ? updatedCar : car
      );
      
      set({ 
        cars,
        filteredCars: get().filter ? 
          cars.filter(car => applyCarFilter(car, get().filter)) : 
          cars,
        selectedCar: get().selectedCar?.id === id ? updatedCar : get().selectedCar,
        isLoading: false 
      });
      
      return updatedCar;
    } catch (error: any) {
      console.error('Помилка оновлення автомобіля:', error.message);
      set({ 
        error: error.message || 'Помилка оновлення автомобіля', 
        isLoading: false 
      });
      return null;
    }
  },

  /**
   * Видалення автомобіля
   * @param id - ID автомобіля
   */
  deleteCar: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Оновлюємо список автомобілів
      const cars = get().cars.filter(car => car.id !== id);
      
      set({ 
        cars,
        filteredCars: get().filter ? 
          cars.filter(car => applyCarFilter(car, get().filter)) : 
          cars,
        selectedCar: get().selectedCar?.id === id ? null : get().selectedCar,
        isLoading: false 
      });
      
      return true;
    } catch (error: any) {
      console.error('Помилка видалення автомобіля:', error.message);
      set({ 
        error: error.message || 'Помилка видалення автомобіля', 
        isLoading: false 
      });
      return false;
    }
  },

  /**
   * Вибір автомобіля
   * @param car - автомобіль або null
   */
  selectCar: (car: Car | null) => {
    set({ selectedCar: car });
  },

  /**
   * Встановлення фільтра
   * @param filter - параметри фільтрації
   */
  setFilter: (filter: CarsState['filter']) => {
    set({ filter });
    get().applyFilter();
  },

  /**
   * Застосування фільтра
   */
  applyFilter: () => {
    const { cars, filter } = get();
    
    if (!filter || Object.keys(filter).length === 0) {
      set({ filteredCars: cars });
      return;
    }
    
    const filteredCars = cars.filter(car => applyCarFilter(car, filter));
    set({ filteredCars });
  },

  /**
   * Очищення фільтра
   */
  clearFilter: () => {
    set({ 
      filter: {},
      filteredCars: get().cars 
    });
  },

  /**
   * Очищення помилки
   */
  clearError: () => {
    set({ error: null });
  }
}));

/**
 * Допоміжна функція для фільтрації автомобілів
 * @param car - автомобіль
 * @param filter - параметри фільтрації
 */
function applyCarFilter(car: Car, filter: CarsState['filter']): boolean {
  // Фільтр за статусом
  if (filter.status && car.status !== filter.status) {
    return false;
  }
  
  // Фільтр за брендом
  if (filter.brand && car.brand.toLowerCase() !== filter.brand.toLowerCase()) {
    return false;
  }
  
  // Фільтр за моделлю
  if (filter.model && !car.model.toLowerCase().includes(filter.model.toLowerCase())) {
    return false;
  }
  
  // Фільтр за роком (від)
  if (filter.yearFrom && car.year < filter.yearFrom) {
    return false;
  }
  
  // Фільтр за роком (до)
  if (filter.yearTo && car.year > filter.yearTo) {
    return false;
  }
  
  // Фільтр за ціною (від)
  if (filter.priceFrom && car.price < filter.priceFrom) {
    return false;
  }
  
  // Фільтр за ціною (до)
  if (filter.priceTo && car.price > filter.priceTo) {
    return false;
  }
  
  return true;
}

// Додаємо підтримку devtools для дебагу в браузері
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Підключаємо Redux DevTools для дебагу
  const devtoolsExt = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (devtoolsExt) {
    const devtools = devtoolsExt.connect({
      name: 'Cars Store',
    });
    
    // Відправляємо початковий стан
    devtools.init(useCarsStore.getState());
    
    // Підписуємося на зміни стану
    useCarsStore.subscribe((state) => {
      devtools.send('state_updated', state);
    });
  }
}

export default useCarsStore;
