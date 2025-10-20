import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Document } from '../types';

// Додаткові типи для документів
export interface DocumentWithCar extends Document {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

export interface DocumentFile {
  uri: string;
  name: string;
  mimeType?: string;
  type?: string;
  size?: number;
}

export const useDocuments = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Отримання списку документів
  const getDocuments = useCallback(async (carId: string): Promise<DocumentWithCar[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_documents')
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as DocumentWithCar[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання документа
  const getDocument = useCallback(async (documentId: string): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;

      return data as Document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Додавання документа
  const addDocument = useCallback(async (carId: string, document: Partial<Document>): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_documents')
        .insert({
          car_id: carId,
          document_type: document.document_type,
          title: document.title,
          file_url: document.file_url,
          expiry_date: document.expiry_date,
          description: document.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data as Document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлення документа
  const updateDocument = useCallback(async (documentId: string, updates: Partial<Document>): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);

      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('car_documents')
        .update(updatesWithTimestamp)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      return data as Document;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення документа
  const deleteDocument = useCallback(async (documentId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Отримуємо інформацію про документ
      const { data: document, error: documentError } = await supabase
        .from('car_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (documentError) throw documentError;

      // Видаляємо файл зі сховища
      if (document.file_url) {
        const fileName = (document.file_url as string).split('/').pop() || '';
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Видаляємо запис з бази даних
      const { error } = await supabase
        .from('car_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Завантаження файлу
  const uploadFile = useCallback(async (file: DocumentFile): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання документів за типом
  const getDocumentsByType = useCallback(async (carId: string, documentType: string): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('car_documents')
        .select('*')
        .eq('car_id', carId)
        .eq('document_type', documentType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Document[];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання документів, що вигасають
  const getExpiringDocuments = useCallback(async (carId: string, daysThreshold: number = 30): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const { data, error } = await supabase
        .from('car_documents')
        .select('*')
        .eq('car_id', carId)
        .not('expiry_date', 'is', null)
        .lte('expiry_date', thresholdDate.toISOString())
        .order('expiry_date', { ascending: true });

      if (error) throw error;

      return data as Document[];
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
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    getDocumentsByType,
    getExpiringDocuments,
    pickDocument,
    openDocument
  };
};

export default useDocuments;
