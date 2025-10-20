import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DocumentType } from '../components/documentsList';

/**
 * Дані для форми документа
 */
export interface DocumentFormData {
  /** Тип документа */
  type: DocumentType;
  /** Назва документа */
  title: string;
  /** Опис документа */
  description?: string;
  /** Номер документа */
  number?: string;
  /** Дата видачі документа */
  date: Date;
  /** Термін дії документа */
  expiryDate?: Date | null;
  /** Файл документа */
  file?: DocumentFile | null;
}

/**
 * Дані файлу документа
 */
export interface DocumentFile {
  /** URI файлу */
  uri: string;
  /** Назва файлу */
  name: string;
  /** MIME-тип файлу */
  type: string;
  /** Розмір файлу в байтах */
  size: number;
}

/**
 * Результат валідації форми документа
 */
export interface DocumentFormValidation {
  /** Чи валідна форма */
  isValid: boolean;
  /** Помилки валідації */
  errors: {
    /** Помилка типу документа */
    type?: string;
    /** Помилка назви документа */
    title?: string;
    /** Помилка опису документа */
    description?: string;
    /** Помилка номера документа */
    number?: string;
    /** Помилка дати видачі документа */
    date?: string;
    /** Помилка терміну дії документа */
    expiryDate?: string;
    /** Помилка файлу документа */
    file?: string;
  };
}

/**
 * Параметри маршруту для екрану додавання/редагування документа
 */
export interface AddEditDocumentRouteParams {
  /** ID автомобіля */
  carId: string | number;
  /** ID документа (для редагування) */
  documentId?: string | number;
  /** Тип документа (для додавання) */
  documentType?: DocumentType;
}

/**
 * Пропси для екрану додавання/редагування документа
 */
export interface AddEditDocumentScreenProps {
  /** Об'єкт маршруту */
  route: RouteProp<{ params: AddEditDocumentRouteParams }, 'params'>;
  /** Об'єкт навігації */
  navigation: NativeStackNavigationProp<any>;
}
