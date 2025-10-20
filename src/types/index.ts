// Загальні типи для всього додатку

// Типи для екранів
export * from './screens';

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
  licensePlate?: string;
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
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
}

// Типи для витрат
export interface Expense {
  id: string;
  car_id: string;
  expense_type: string;
  amount: number;
  date: string;
  description?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithCar extends Expense {
  cars: {
    brand: string;
    model: string;
    year: number;
    registration_number?: string;
  };
}

// Типи для документів
export interface Document {
  id: string;
  car_id: string;
  document_type: string;
  title: string;
  file_url: string;
  expiry_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Типи для пробігу
export interface Mileage {
  id: string;
  car_id: string;
  value: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Типи для покупців
export interface Buyer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Типи для користувачів
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Типи для файлів і зображень
export interface ImagePickResult {
  uri: string;
  type?: string;
  name?: string;
}

export interface FileUploadResult {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

// Типи для офлайн-режиму
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

// Типи для фільтрів
export interface CarFilters {
  status?: 'active' | 'sold' | 'archived';
  brand?: string;
  model?: string;
  year?: number;
  engine_type?: string;
}

export interface ExpensePeriodFilter {
  month?: number;
  year?: number;
  carId?: string;
}

// Типи для статистики
export interface ExpenseStats {
  total: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
  averagePerMonth: number;
  count: number;
}

export interface MileageStats {
  total: number;
  average: number;
  perMonth: Record<string, number>;
  lastValue: number;
  firstValue: number;
}

// Типи для сповіщень
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  related_id?: string;
  related_type?: string;
  created_at: string;
}

// Типи для аналітики
export interface AnalyticsData {
  expenses: {
    total: number;
    byType: Record<string, number>;
    byMonth: Record<string, number>;
  };
  cars: {
    total: number;
    byStatus: Record<string, number>;
  };
  mileage: {
    total: number;
    average: number;
  };
}

// Типи для налаштувань
export interface Settings {
  language: 'uk' | 'ru';
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notifications: boolean;
  autoSync: boolean;
}

// Типи для помилок
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}
