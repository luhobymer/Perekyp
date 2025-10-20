import { createClient, SupabaseClient, SupabaseClientOptions, User, AuthError, Session } from '@supabase/supabase-js';
import { storageAdapter } from './storage';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { Platform } from 'react-native';
import i18n from './i18n';
import { ExpensesAnalytics, ProfitsAnalytics, CarsAnalytics } from '../types/analytics';
import type { AnalyticsPeriod as AnalyticsPeriodType } from '../types/analytics';

// Types for our database schema
type Car = {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  license_plate?: string;
  color?: string;
  mileage: number;
  purchase_price: number;
  purchase_date?: string;
  sold_price?: number;
  sold_date?: string;
  status: 'active' | 'sold' | 'reserved' | 'maintenance';
  created_at: string;
  updated_at: string;
};

type Expense = {
  id: string;
  car_id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
};

type MileageRecord = {
  id: string;
  car_id: string;
  user_id: string;
  mileage: number;
  date: string;
  notes?: string;
  created_at: string;
};

// Використовується в аналітичних запитах
export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all'
}

// Define the shape of our Supabase client with custom types
interface CustomSupabaseClient extends SupabaseClient {
  // Add any custom methods or overrides here if needed
}

// Check if we're in a server environment
const isServer: boolean = typeof window === 'undefined';

// Function to initialize Supabase client
const createSupabaseClient = (): CustomSupabaseClient | null => {
  try {
    const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || 
                         process.env.EXPO_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || 
                             process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    // Log for debugging
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('URL validation before client creation:', SUPABASE_URL ? 'URL OK' : 'URL missing');

    // Check if we have the required configuration
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing Supabase configuration');
      return null;
    }

    console.log('Initializing Supabase ' + (isServer ? 'for server (SSR)' : 'for client'));
    
    // Опції для Supabase клієнта
    const options: SupabaseClientOptions<'public'> = {
      auth: {
        // Use our storage adapter for token persistence
        storage: storageAdapter,
        autoRefreshToken: !isServer,
        persistSession: !isServer,
        detectSessionInUrl: !isServer
      }
    };
    
    // Додаємо спеціальні налаштування для мобільних платформ
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Для мобільних платформ відключаємо функціональність реального часу
      options.realtime = {
        params: {
          eventsPerSecond: 0 // Відключаємо всі події реального часу
        }
      };
    }
    
    // Create the client with appropriate options based on environment
    const client: CustomSupabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      options
    ) as CustomSupabaseClient;

    // Log the client connection status for debugging
    console.log('Supabase client initialized:', client ? 'Success' : 'Failed');
    // Не використовуємо захищену властивість supabaseUrl
    console.log('Supabase connection established');
    
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
};

// Create and export the Supabase client
const supabase: CustomSupabaseClient | null = createSupabaseClient();

// Authentication service
export const authService = {
  /**
   * Register a new user
   */
  async signUp(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert(i18n.t('error'), authError.message);
      return { user: null, error: authError };
    }
  },
  
  /**
   * Sign in a user
   */
  async signIn(email: string, password: string): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert(i18n.t('error'), authError.message);
      return { session: null, error: authError };
    }
  },
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert(i18n.t('error'), authError.message);
      return { error: authError };
    }
  },
  
  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error getting current user:', authError.message);
      return { user: null, error: authError };
    }
  },
  
  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert(i18n.t('error'), authError.message);
      return { error: authError };
    }
  },
};

// Cars service
export const carsService = {
  /**
   * Get all cars for a user
   */
  async getCars(userId: string): Promise<{ data: Car[] | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching cars:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Get a single car by ID
   */
  async getCarById(carId: string): Promise<{ data: Car | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching car ${carId}:`, error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Add a new car
   */
  async addCar(carData: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Car | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Update a car
   */
  async updateCar(carId: string, carData: Partial<Omit<Car, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<{ data: Car | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', carId)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Delete a car
   */
  async deleteCar(carId: string): Promise<{ error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);
        
      if (error) throw error;
      return { error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { error: error as Error };
    }
  },
  
  /**
   * Mark a car as sold
   */
  async sellCar(carId: string, sellData: { sold_price: number; sold_date: string }): Promise<{ data: Car | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('cars')
        .update({
          status: 'sold',
          sold_price: sellData.sold_price,
          sold_date: sellData.sold_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', carId)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
};

// Expenses service
export const expensesService = {
  /**
   * Get expenses for a car
   */
  async getExpenses(carId: string): Promise<{ data: Expense[] | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Add a new expense
   */
  async addExpense(expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Expense | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Update an expense
   */
  async updateExpense(expenseId: string, expenseData: Partial<Omit<Expense, 'id' | 'car_id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<{ data: Expense | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('expenses')
        .update({
          ...expenseData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', expenseId)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Delete an expense
   */
  async deleteExpense(expenseId: string): Promise<{ error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
        
      if (error) throw error;
      return { error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { error: error as Error };
    }
  },
};

// Mileage service
export const mileageService = {
  /**
   * Get mileage history for a car
   */
  async getMileageHistory(carId: string): Promise<{ data: MileageRecord[] | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const { data, error } = await supabase
        .from('mileage_history')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching mileage history:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Add a new mileage record
   */
  async addMileageRecord(mileageData: Omit<MileageRecord, 'id' | 'created_at'>): Promise<{ data: MileageRecord | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // First, update the car's current mileage
      const { error: updateError } = await supabase
        .from('cars')
        .update({ mileage: mileageData.mileage })
        .eq('id', mileageData.car_id);
        
      if (updateError) throw updateError;
      
      // Then add the mileage record
      const { data, error } = await supabase
        .from('mileage_history')
        .insert([mileageData])
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      Alert.alert(i18n.t('error'), (error as Error).message);
      return { data: null, error: error as Error };
    }
  },
};

// Analytics service
export const analyticsService = {
  /**
   * Get expense statistics
   */
  async getExpensesStats(userId: string, period: AnalyticsPeriodType = 'month'): Promise<{ data: ExpensesAnalytics | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // This is a simplified example - you'd need to implement the actual query based on your analytics needs
      const { data, error } = await supabase
        .rpc('get_expense_stats', { user_id: userId, time_period: period });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching expense stats:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Get profit statistics
   */
  async getProfitsStats(userId: string, period: AnalyticsPeriodType = 'month'): Promise<{ data: ProfitsAnalytics | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // This is a simplified example - you'd need to implement the actual query based on your analytics needs
      const { data, error } = await supabase
        .rpc('get_profit_stats', { user_id: userId, time_period: period });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching profit stats:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Get car statistics
   */
  async getCarsStats(userId: string): Promise<{ data: CarsAnalytics | null; error: Error | null }> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      // This is a simplified example - you'd need to implement the actual query based on your analytics needs
      const { data, error } = await supabase
        .rpc('get_car_stats', { user_id: userId });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching car stats:', error);
      return { data: null, error: error as Error };
    }
  },
};

export default supabase;
