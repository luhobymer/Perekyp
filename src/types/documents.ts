/**
 * Типи для модуля документів
 */

// Типи документів
export type DocumentType = 
  | 'technical_passport' 
  | 'insurance' 
  | 'purchase_agreement' 
  | 'sale_agreement' 
  | 'service_book' 
  | 'inspection_report' 
  | 'other';

// Інформація про тип документу
export interface DocumentTypeInfo {
  id: DocumentType;
  icon: string;
}

// Модель документу
export interface Document {
  id: number | string;
  carId: number | string;
  type: DocumentType;
  name: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadDate: string;
  expiryDate?: string;
  notes?: string;
}

// Параметри для екрану документів
export interface DocumentScreenParams {
  carId: number | string;
  carMake: string;
  carModel: string;
}

// Результат вибору документу
export interface DocumentPickerResult {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
}

// Дані для завантаження документу
export interface DocumentUploadData {
  carId: number | string;
  type: DocumentType;
  file: DocumentPickerResult;
  notes?: string;
}
