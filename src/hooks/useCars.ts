import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { PostgrestError, User } from '@supabase/supabase-js';

// Типи для автомобілів
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  body_type?: string;
  vin?: string;
  reg_number?: string;
  registration_number?: string;
  engine_type?: string;
  engine_volume?: number;
  transmission?: string;
  color?: string;
  mileage?: number;
  status?: 'active' | 'sold' | 'archived';
  purchase_date?: string;
  price?: number;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Додаткові поля для сумісності з інтерфейсом Car в types/cars.ts
  images?: string[];
  last_service_date?: string;
  next_service_date?: string;
  documents?: any[];
  expenses?: any[];
  specifications?: {
    transmission?: string;
    drive?: string;
    fuel?: string;
    consumption?: {
      city?: string;
      highway?: string;
      combined?: string;
    };
    dimensions?: {
      length?: string;
      width?: string;
      height?: string;
      weight?: string;
    };
    performance?: {
      acceleration?: string;
      topSpeed?: string;
      horsepower?: string;
      torque?: string;
    };
    safety?: string[];
    comfort?: string[];
    entertainment?: string[];
    other?: string[];
  };
  // Поля для сумісності з іншими інтерфейсами
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

export interface CarFilters {
  status?: 'active' | 'sold' | 'archived';
  brand?: string;
  model?: string;
  year?: number;
  engine_type?: string;
}

export interface ImagePickResult {
  uri: string;
  type?: string;
  name?: string;
}

export const useCars = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);

  // Перевірка дозволів для роботи з файлами
  const checkPermissions = useCallback(async (): Promise<void> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Потрібен дозвіл для доступу до медіафайлів');
      }
    }
  }, []);

  // Отримання списку автомобілів
  const getCars = useCallback(async (filters: CarFilters = {}): Promise<Car[]> => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      // Застосовуємо фільтри
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      if (filters.model) {
        query = query.eq('model', filters.model);
      }

      if (filters.year) {
        query = query.eq('year', filters.year);
      }

      if (filters.engine_type) {
        query = query.eq('engine_type', filters.engine_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('Fetched cars:', data?.length || 0);
      setCars(data || []);
      return data as Car[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Error fetching cars:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання автомобіля
  const getCar = useCallback(async (carId: string): Promise<Car> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (error) throw error;

      return data as Car;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання автомобіля
  const addCar = useCallback(async (car: Partial<Car>): Promise<Car> => {
    try {
      setLoading(true);
      setError(null);
      
      // Отримуємо поточного користувача, якщо user_id не визначено
      if (!car.user_id) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) {
          throw new Error('User is not authenticated');
        }
        car.user_id = userData.user.id;
      }
      
      console.log('Adding car with data:', car);

      const { data, error } = await supabase
        .from('cars')
        .insert({
          brand: car.brand,
          model: car.model,
          year: car.year,
          body_type: car.body_type,
          vin: car.vin,
          reg_number: car.reg_number,
          registration_number: car.registration_number,
          engine_type: car.engine_type,
          engine_volume: car.engine_volume,
          transmission: car.transmission,
          color: car.color,
          mileage: car.mileage,
          status: car.status,
          purchase_date: car.purchase_date,
          price: car.price,
          description: car.description,
          user_id: car.user_id,
          created_at: car.created_at || new Date().toISOString(),
          updated_at: car.updated_at || new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Car added successfully:', data);
      
      // Додаємо автомобіль до списку
      setCars(prev => [data as Car, ...prev]);

      return data as Car;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення автомобіля
  const updateCar = useCallback(async (carId: string, updates: Partial<Car>): Promise<Car> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('cars')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', carId)
        .select()
        .single();

      if (error) throw error;
      
      // Оновлюємо автомобіль у списку
      setCars(prev => prev.map(car => car.id === carId ? { ...car, ...data } as Car : car));

      return data as Car;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення автомобіля
  const deleteCar = useCallback(async (carId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;
      
      // Видаляємо автомобіль зі списку
      setCars(prev => prev.filter(car => car.id !== carId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантаження зображення
  const uploadImage = useCallback(async (carId: string, image: ImagePickResult, isMain: boolean = false): Promise<CarImage> => {
    try {
      setLoading(true);
      setError(null);
      
      // Перевіряємо дозволи
      await checkPermissions();

      // Завантажуємо зображення в Supabase Storage
      const fileExt = image.uri.split('.').pop() || 'jpg';
      const fileName = `${carId}_${Date.now()}.${fileExt}`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Копіюємо файл в локальну директорію
      await FileSystem.copyAsync({
        from: image.uri,
        to: filePath
      });

      // Завантажуємо файл в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car_images')
        .upload(fileName, {
          uri: filePath,
          type: image.type || 'image/jpeg',
          name: image.name || fileName
        });

      if (uploadError) throw uploadError;

      // Отримуємо публічний URL
      const { data: { publicUrl } } = supabase.storage
        .from('car_images')
        .getPublicUrl(fileName);

      // Якщо це головне зображення, скидаємо інші
      if (isMain) {
        const { error: updateError } = await supabase
          .from('car_images')
          .update({ is_main: false })
          .eq('car_id', carId);

        if (updateError) throw updateError;
      }

      // Додаємо запис в базу даних
      const { data, error } = await supabase
        .from('car_images')
        .insert({
          car_id: carId,
          image_url: publicUrl,
          is_main: isMain
        })
        .select()
        .single();

      if (error) throw error;

      // Видаляємо локальну копію
      await FileSystem.deleteAsync(filePath);

      return data as CarImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkPermissions]);

  // Видалення зображення
  const deleteImage = useCallback(async (imageId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про зображення
      const { data: image, error: imageError } = await supabase
        .from('car_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (imageError) throw imageError;

      // Видаляємо файл з Supabase Storage
      const fileName = (image.image_url as string).split('/').pop() || '';
      const { error: storageError } = await supabase.storage
        .from('car_images')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Видаляємо запис
      const { error } = await supabase
        .from('car_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Вибір зображення
  const pickImage = useCallback(async (): Promise<ImagePickResult | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8
      });

      if (!result.canceled) {
        return {
          uri: result.assets[0].uri
        };
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Відкриття зображення
  const openImage = useCallback(async (imageUrl: string): Promise<void> => {
    try {
      await Sharing.shareAsync(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    cars,
    getCars,
    getCar,
    addCar,
    updateCar,
    deleteCar,
    uploadImage,
    deleteImage,
    pickImage,
    openImage
  };
};

export default useCars;
