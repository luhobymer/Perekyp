import { supabase } from '../utils/supabase';
import * as FileSystem from 'expo-file-system';
import { nanoid } from 'nanoid';
import { Platform } from 'react-native';
import { Car } from '../types';

// Інтерфейси для роботи з сервісом авто
interface CarData extends Omit<Car, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CarDocument {
  id: string;
  car_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_url: string;
  created_at: string;
}

interface MileageHistory {
  id: string;
  car_id: string;
  mileage: number;
  date: string;
  created_at?: string;
}

// Сервіс для роботи з автомобілями
const carService = {
  // Отримання списку автомобілів користувача
  async getCars(userId: string): Promise<Car[]> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cars:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Отримання даних конкретного автомобіля
  async getCarById(carId: string): Promise<Car> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching car ${carId}:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Створення нового автомобіля
  async createCar(carData: CarData): Promise<Car> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating car:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Оновлення даних автомобіля
  async updateCar(carId: string, carData: Partial<CarData>): Promise<Car> {
    try {
      const { data, error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', carId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating car:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення автомобіля
  async deleteCar(carId: string): Promise<boolean> {
    try {
      // Видалення всіх пов'язаних даних для авто
      await Promise.all([
        supabase.from('expenses').delete().eq('car_id', carId),
        supabase.from('mileage_history').delete().eq('car_id', carId),
        supabase.from('car_documents').delete().eq('car_id', carId),
        // Видалення зображень з bucket
        this.deleteAllCarImages(carId),
        this.deleteAllCarDocuments(carId)
      ]);

      // Видалення самого автомобіля
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting car:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Завантаження зображення автомобіля
  async uploadCarImage(carId: string, uri: string, fileName: string): Promise<string> {
    try {
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `${carId}_${nanoid()}.${fileExtension}`;
      const filePath = `${carId}/${uniqueFileName}`;
      
      // Завантаження файлу
      let fileData: string | Blob;
      if (Platform.OS === 'web') {
        // Для веб-платформи
        const res = await fetch(uri);
        const blob = await res.blob();
        fileData = blob;
      } else {
        // Для мобільних платформ
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        fileData = base64;
      }
      
      const { error: uploadError, data } = await supabase.storage
        .from('car_images')
        .upload(filePath, fileData, {
          contentType: `image/${fileExtension}`,
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Отримання публічного URL
      const { data: urlData } = supabase.storage
        .from('car_images')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading car image:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення зображення автомобіля
  async deleteCarImage(imagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('car_images')
        .remove([imagePath]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting car image:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення всіх зображень автомобіля
  async deleteAllCarImages(carId: string): Promise<boolean> {
    try {
      // Отримання списку файлів у папці авто
      const { data, error } = await supabase.storage
        .from('car_images')
        .list(carId.toString());
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const filePaths = data.map(file => `${carId}/${file.name}`);
        
        const { error: deleteError } = await supabase.storage
          .from('car_images')
          .remove(filePaths);
          
        if (deleteError) throw deleteError;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting all car images:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Завантаження документа авто
  async uploadCarDocument(carId: string, uri: string, fileName: string, documentType: string): Promise<CarDocument> {
    try {
      const fileExtension = fileName.split('.').pop() || 'pdf';
      const uniqueFileName = `${carId}_${nanoid()}.${fileExtension}`;
      const filePath = `${carId}/${uniqueFileName}`;
      
      // Завантаження файлу
      let fileData: string | Blob;
      if (Platform.OS === 'web') {
        // Для веб-платформи
        const res = await fetch(uri);
        const blob = await res.blob();
        fileData = blob;
      } else {
        // Для мобільних платформ
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        fileData = base64;
      }
      
      const { error: uploadError } = await supabase.storage
        .from('car_documents')
        .upload(filePath, fileData, {
          contentType: `application/${fileExtension}`,
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Отримання публічного URL
      const { data: urlData } = supabase.storage
        .from('car_documents')
        .getPublicUrl(filePath);
      
      // Додавання запису про документ
      const { data: docData, error: docError } = await supabase
        .from('car_documents')
        .insert([{
          car_id: carId,
          document_type: documentType,
          file_name: fileName,
          file_path: filePath,
          file_url: urlData.publicUrl,
          created_at: new Date().toISOString()
        }])
        .select();
        
      if (docError) throw docError;
      
      return docData[0];
    } catch (error) {
      console.error('Error uploading car document:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Отримання документів авто
  async getCarDocuments(carId: string): Promise<CarDocument[]> {
    try {
      const { data, error } = await supabase
        .from('car_documents')
        .select('*')
        .eq('car_id', carId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching car documents:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення документа авто
  async deleteCarDocument(documentId: string): Promise<boolean> {
    try {
      // Отримання даних документа перед видаленням
      const { data, error: fetchError } = await supabase
        .from('car_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Видалення файлу з bucket
      if (data && data.file_path) {
        const { error: storageError } = await supabase.storage
          .from('car_documents')
          .remove([data.file_path]);
          
        if (storageError) throw storageError;
      }
      
      // Видалення запису про документ
      const { error } = await supabase
        .from('car_documents')
        .delete()
        .eq('id', documentId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting car document:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення всіх документів авто
  async deleteAllCarDocuments(carId: string): Promise<boolean> {
    try {
      // Отримання списку файлів у папці авто
      const { data, error } = await supabase.storage
        .from('car_documents')
        .list(carId.toString());
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const filePaths = data.map(file => `${carId}/${file.name}`);
        
        const { error: deleteError } = await supabase.storage
          .from('car_documents')
          .remove(filePaths);
          
        if (deleteError) throw deleteError;
      }
      
      // Видалення записів про документи
      const { error: deleteRecordsError } = await supabase
        .from('car_documents')
        .delete()
        .eq('car_id', carId);
        
      if (deleteRecordsError) throw deleteRecordsError;
      
      return true;
    } catch (error) {
      console.error('Error deleting all car documents:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Додавання запису в історію пробігу
  async addMileageHistory(carId: string, mileage: number): Promise<MileageHistory> {
    try {
      const { data, error } = await supabase
        .from('mileage_history')
        .insert([{
          car_id: carId,
          mileage,
          date: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding mileage history:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Отримання історії пробігу
  async getMileageHistory(carId: string): Promise<MileageHistory[]> {
    try {
      const { data, error } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching mileage history:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
};

export default carService;
