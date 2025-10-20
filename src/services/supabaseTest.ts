import { supabase } from './supabase';

interface TestResult {
  success: boolean;
  data?: any;
  error?: Error | unknown;
}

// Test connection to Supabase
export async function testSupabaseConnection(): Promise<TestResult> {
  console.log('Testing connection to Supabase');
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection test successful:', data);
    return { success: true, data };
  } catch (e) {
    console.error('Exception when connecting to Supabase:', e);
    return { success: false, error: e };
  }
}

export default testSupabaseConnection;
