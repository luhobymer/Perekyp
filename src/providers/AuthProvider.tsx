import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { AuthContextType } from '../hooks/useAuth';
import { Platform, Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
import NetInfo from '@react-native-community/netinfo';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Налагоджувальна інформація
  console.log('Supabase підключений:', !!supabase);

  // Функція для перевірки існування користувача в базі даних
  const checkUserExists = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Помилка перевірки користувача:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Помилка перевірки користувача:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Перевірка сесії користувача...');
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Помилка отримання сесії:', sessionError);
          throw sessionError;
        }
        
        console.log('Дані сесії:', data);
        
        if (data?.session?.user) {
          const userExists = await checkUserExists(data.session.user.id);
          if (!userExists) {
            console.log('Користувача не знайдено в базі даних, виконуємо вихід');
            await supabase.auth.signOut();
            setUser(null);
            return;
          }
        }
        
        setUser(data?.session?.user || null);
      } catch (error) {
        console.error('Помилка перевірки статусу автентифікації:', error);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Зміна стану автентифікації:', event);
        console.log('Дані сесії:', session);
        
        if (session?.user) {
          const userExists = await checkUserExists(session.user.id);
          if (!userExists) {
            console.log('Користувача не знайдено в базі даних, виконуємо вихід');
            await supabase.auth.signOut();
            setUser(null);
            return;
          }
        }
        
        setUser(session?.user || null);
        setInitializing(false);
      }
    );

    checkUser();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const netInfo = await NetInfo.fetch();
      console.log('Network status:', netInfo);
      
      if (!netInfo.isConnected) {
        throw new Error('Відсутнє підключення до мережі. Перевірте з\'єднання та спробуйте знову.');
      }
      
      console.log(`Спроба входу з email: ${email}`);
      
      // Спроба входу з перевіркою помилок
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error('Помилка автентифікації:', signInError);
        throw signInError;
      }
      
      if (!data?.user) {
        throw new Error('Не вдалося отримати дані користувача');
      }
      
      // Перевірка існування користувача в базі даних
      const userExists = await checkUserExists(data.user.id);
      
      // Якщо профіль не існує, створюємо його
      if (!userExists) {
        console.log('Профіль користувача не знайдено, створюємо новий');
        try {
          // Спробуємо створити профіль через upsert
          console.log('Спроба створення профілю через upsert...');
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
            
          if (profileError) {
            console.error('Помилка створення профілю при вході через upsert:', profileError);
            
            // Спробуємо через REST API напряму
            console.log('Спроба створення профілю через REST API...');
            try {
              const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/profiles`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
                  'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''}`,
                  'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                  id: data.user.id,
                  email: data.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }),
              });
              
              if (!response.ok) {
                console.error('Помилка створення профілю через REST API:', response.status);
                console.log('Не вдалося створити профіль, але не зупиняємо процес входу');
              } else {
                console.log('Профіль успішно створено через REST API');
              }
            } catch (restError) {
              console.error('Помилка при виклику REST API:', restError);
            }
          } else {
            console.log('Профіль успішно створено при першому вході');
          }
        } catch (profileError) {
          console.error('Помилка при спробі створення профілю:', profileError);
          console.log('Продовжуємо вхід навіть без профілю');
        }
      }
      
      setUser(data.user);
      console.log('Успішний вхід для:', data.user.email);
      return { success: true };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Невідома помилка';
      console.error('Помилка входу:', errorMessage);
      setError(errorMessage);
      if (Platform.OS !== 'web') {
        Alert.alert('Помилка входу', errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Вхід через Google...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: Platform.OS === 'web' ? window.location.origin : 'perekypapp://auth/callback'
        }
      });
      
      if (error) throw error;
      console.log('Google OAuth успішно запущено', data);
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error?.message || 'Помилка входу через Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Початок реєстрації користувача...');
      
      // Створюємо користувача через Auth API
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Помилка реєстрації в Supabase:', error);
        throw error;
      }

      if (data?.user) {
        console.log('Користувача успішно створено. ID:', data.user.id);
        
        try {
          // Перевіряємо, чи створено профіль (можливо, його вже створив тригер)
          console.log('Перевіряємо наявність профілю...');
          const { data: profileData, error: profileCheckError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profileCheckError) {
            console.log('Помилка перевірки профілю:', profileCheckError);
            
            // Спроба створення профілю
            console.log('Профіль не знайдено. Спроба створення профілю...');
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, { onConflict: 'id' });
              
            if (profileError && profileError.code !== '23505') {
              console.warn('Помилка створення профілю:', profileError);
            } else {
              console.log('Профіль успішно створено або оновлено через upsert');
            }
          } else {
            console.log('Перевірка профілю завершена. Профіль існує:', !!profileData);
          }
        } catch (profileError) {
          console.error('Помилка при роботі з профілем:', profileError);
        }

        // Встановлюємо користувача та повертаємо успіх
        setUser(data.user);
        console.log('Реєстрація повністю завершена успішно');
        return { success: true };
      }
      
      console.error('Не вдалося створити користувача: дані користувача відсутні в відповіді');
      return { success: false, error: 'Не вдалося створити користувача' };
    } catch (error: unknown) {
      console.error('Помилка реєстрації:', error);
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message || 'Помилка виходу');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error('Помилка повторного відправлення:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      setError(error.message || 'Помилка повторного відправлення');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        resendConfirmation,
        error,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 