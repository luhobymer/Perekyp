import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Отримуємо налаштування з змінних оточення
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kjnbhiyrxtdaohxssynx.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';

// Виводимо URL для діагностики
console.log('Supabase URL:', supabaseUrl);
console.log('Auth API URL:', `${supabaseUrl}/auth/v1`);

// Перевіряємо середовище виконання
const isServer = typeof window === 'undefined';
const isBrowser = typeof window !== 'undefined';
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Визначаємо URL для перенаправлення після автентифікації
const getRedirectUrl = () => {
  if (Platform.OS === 'web' && !isServer) {
    return window.location.origin;
  } else {
    // Для мобільних пристроїв використовуємо схему з app.json
    return 'perekypapp://auth/callback';
  }
};

// Створюємо клієнт Supabase з правильними налаштуваннями для поточного середовища
let supabaseOptions: any = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

// Конфігуруємо сховище сесій в залежності від середовища
if (isReactNative) {
  // Для React Native використовуємо AsyncStorage
  supabaseOptions = {
    auth: {
      ...supabaseOptions.auth,
      storage: AsyncStorage
    }
  };
} else if (isServer) {
  // Для серверного середовища відключаємо автоматичне оновлення токена
  supabaseOptions = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  };
}

// Створюємо клієнт Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions);

// Тестова функція для перевірки URL і підключення
export async function testConnection() {
  try {
    console.log('Перевірка підключення до Supabase...', supabaseUrl);
    const { data, error } = await supabase.from('cars').select('count').limit(1);
    
    if (error) {
      console.error('Помилка підключення до Supabase:', error);
      return { success: false, error, url: supabaseUrl };
    }
    
    console.log('Успішне підключення до Supabase. Дані:', data);
    return { success: true, data, url: supabaseUrl };
  } catch (error) {
    console.error('Виняток при підключенні до Supabase:', error);
    return { success: false, error, url: supabaseUrl };
  }
} 