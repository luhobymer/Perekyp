import { createClient } from '@supabase/supabase-js';

interface TestResult {
  success: boolean;
  data?: any;
  error?: Error | unknown;
}

/**
 * Прямий тест підключення до Supabase з найпростішою конфігурацією
 * Перевіряє з'єднання з базою даних та Auth API
 */
async function testSupabaseConnection(): Promise<TestResult> {
  console.log("Тестуємо з'єднання з Supabase...");
  
  const supabaseUrl = 'https://kjnbhiyrxtdaohxssynx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';
  
  console.log("Створюємо клієнта Supabase...");
  
  try {
    // Створюємо клієнт без залежності від сховища сесій
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });
    
    // Тестуємо запит до бази даних
    console.log("Запитуємо таблицю cars...");
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error("Помилка з'єднання з таблицею cars:", error);
      return { success: false, error };
    } else {
      console.log("Успішне з'єднання! Дані:", data);
    }
    
    // Тестуємо Auth API через прямий REST-запит
    console.log("Тестуємо Auth API...");
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });
    
    console.log("Статус відповіді Auth API:", authResponse.status);
    const authData = await authResponse.json();
    console.log("Відповідь Auth API:", authData);
    
    return { success: true, data };
    
  } catch (error) {
    console.error("Помилка при тестуванні з'єднання:", error);
    return { success: false, error };
  }
}

// Виклик під час імпорту можуть спричиняти проблеми - краще експортувати функцію
// і викликати її явно там, де потрібно
// testSupabaseConnection();

export default testSupabaseConnection;
