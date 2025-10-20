import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Тип документа для автомобіля
 */
export type DocumentType = 
  | 'technical_passport' 
  | 'insurance' 
  | 'purchase_agreement' 
  | 'sale_agreement' 
  | 'service_book' 
  | 'inspection_report' 
  | 'other';

/**
 * Інформація про тип документа
 */
export interface DocumentTypeInfo {
  /** Унікальний ідентифікатор типу документа */
  id: DocumentType;
  /** Назва іконки з Ionicons */
  icon: string;
}

/**
 * Документ автомобіля
 */
export interface CarDocument {
  /** Унікальний ідентифікатор документа */
  id: string | number;
  /** Ідентифікатор автомобіля */
  carId: string | number;
  /** Тип документа */
  type: DocumentType;
  /** Назва документа */
  name: string;
  /** URL до файлу документа */
  fileUrl: string;
  /** MIME-тип файлу */
  fileType: string;
  /** Розмір файлу в байтах */
  fileSize: number;
  /** Дата додавання документа */
  createdAt: string;
  /** Дата останнього оновлення документа */
  updatedAt: string;
}

/**
 * Параметри маршруту для екрану документів автомобіля
 */
export interface CarDocumentsRouteParams {
  /** Ідентифікатор автомобіля */
  carId: string | number;
  /** Марка автомобіля */
  carMake: string;
  /** Модель автомобіля */
  carModel: string;
}

/**
 * Пропси для екрану документів автомобіля
 */
export interface CarDocumentsScreenProps {
  /** Об'єкт маршруту */
  route: RouteProp<{ params: CarDocumentsRouteParams }, 'params'>;
  /** Об'єкт навігації */
  navigation: NativeStackNavigationProp<any>;
}
