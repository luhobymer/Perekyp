import { Database } from './database.types';
import { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientType = SupabaseClient<Database>;

export interface Car {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  body_type?: string;
  vin?: string;
  reg_number?: string;
  engine_type?: string;
  engine_volume?: number;
  color?: string;
  mileage?: number;
  status: 'active' | 'sold' | 'checking' | 'repairing' | 'purchased';
  purchase_price?: number;
  purchase_date?: string;
  created_at: string;
  updated_at: string;
  description?: string;
  transmission?: 'automatic' | 'manual' | 'semi_automatic' | 'variator';
}

export interface Expense {
  id: string;
  car_id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Mileage {
  id: string;
  car_id: string;
  user_id: string;
  value: number;
  date: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  car_id: string;
  user_id: string;
  type: string;
  url: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  car_id: string;
  user_id: string;
  price: number;
  date: string;
  buyer_name?: string;
  buyer_phone?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

export interface SupabaseService {
  // Авторизація
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updatePassword: (password: string) => Promise<AuthResponse>;
  getCurrentUser: () => Promise<{ user: any | null; error: any | null }>;
  
  // Автомобілі
  getCars: (userId: string) => Promise<{ cars: Car[]; error: any | null }>;
  getCarById: (carId: string) => Promise<{ car: Car | null; error: any | null }>;
  createCar: (carData: Partial<Car>) => Promise<{ car: Car | null; error: any | null }>;
  updateCar: (carId: string, carData: Partial<Car>) => Promise<{ car: Car | null; error: any | null }>;
  deleteCar: (carId: string) => Promise<{ success: boolean; error: any | null }>;
  
  // Витрати
  getExpenses: (carId: string) => Promise<{ expenses: Expense[]; error: any | null }>;
  createExpense: (expenseData: Partial<Expense>) => Promise<{ expense: Expense | null; error: any | null }>;
  updateExpense: (expenseId: string, expenseData: Partial<Expense>) => Promise<{ expense: Expense | null; error: any | null }>;
  deleteExpense: (expenseId: string) => Promise<{ success: boolean; error: any | null }>;
  
  // Пробіг
  getMileageHistory: (carId: string) => Promise<{ history: Mileage[]; error: any | null }>;
  updateMileage: (carId: string, value: number) => Promise<{ mileage: Mileage | null; error: any | null }>;
  
  // Документи
  getDocuments: (carId: string) => Promise<{ documents: Document[]; error: any | null }>;
  uploadDocument: (carId: string, file: any, type: string) => Promise<{ document: Document | null; error: any | null }>;
  deleteDocument: (documentId: string) => Promise<{ success: boolean; error: any | null }>;
  
  // Продаж
  markCarAsSold: (carId: string, saleData: Partial<Sale>) => Promise<{ sale: Sale | null; error: any | null }>;
  
  // Аналітика
  getExpensesStats: (userId: string, period?: string) => Promise<any>;
  getProfitsStats: (userId: string, period?: string) => Promise<any>;
  getCarsStats: (userId: string) => Promise<any>;
}
