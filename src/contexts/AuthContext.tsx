import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';
import testSupabaseConnection from '../services/supabaseTest';
import { Alert } from 'react-native';
import { AuthContextType, AuthProviderProps } from '../types/authContext';
import { User } from '../types/auth';

// Створення контексту з типом
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для використання контексту
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер для контексту
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Тестування підключення до Supabase при монтуванні
  useEffect(() => {
    const testConnection = async (): Promise<void> => {
      const result = await testSupabaseConnection();
      console.log('Результат тесту підключення:', result);
      if (!result.success) {
        setAuthError('Не вдалося підключитися до сервера');
      }
    };
    
    testConnection();
  }, []);

  useEffect(() => {
    console.log('AuthProvider: Ініціалізація...');
    // Check active sessions and sets the user
    checkUser();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Зміна стану автентифікації:', event);
      if (event === 'SIGNED_IN') {
        console.log('AuthProvider: Користувач увійшов у систему');
        // Конвертуємо Supabase User в наш тип User
        if (session?.user) {
          const supabaseUser = session.user;
          const appUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            firstName: supabaseUser.user_metadata?.first_name,
            lastName: supabaseUser.user_metadata?.last_name,
            avatar: supabaseUser.user_metadata?.avatar_url,
            phone: supabaseUser.phone || supabaseUser.user_metadata?.phone,
            role: supabaseUser.role || 'user',
            createdAt: supabaseUser.created_at,
            updatedAt: supabaseUser.updated_at || supabaseUser.created_at
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: Користувач вийшов із системи');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Відписка від слухача');
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async (): Promise<void> => {
    try {
      console.log('AuthProvider: Перевірка сесії користувача...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider: Помилка під час перевірки сесії:', error.message);
        setAuthError(error.message);
        throw error;
      }
      
      if (session) {
        console.log('AuthProvider: Знайдено активну сесію користувача');
        // Конвертуємо Supabase User в наш тип User
        const supabaseUser = session.user;
        const appUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: supabaseUser.user_metadata?.first_name,
          lastName: supabaseUser.user_metadata?.last_name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          phone: supabaseUser.phone || supabaseUser.user_metadata?.phone,
          role: supabaseUser.role || 'user',
          createdAt: supabaseUser.created_at,
          updatedAt: supabaseUser.updated_at || supabaseUser.created_at
        };
        setUser(appUser);
      } else {
        console.log('AuthProvider: Активну сесію не знайдено');
        setUser(null);
      }
    } catch (error: any) {
      console.error('AuthProvider: Помилка перевірки сесії користувача:', error.message);
      setAuthError(error.message);
    } finally {
      console.log('AuthProvider: Завершено перевірку сесії, loading=false');
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<any> => {
    try {
      setLoading(true);
      console.log('AuthProvider: Спроба входу за email', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('AuthProvider: Помилка входу:', error.message);
        Alert.alert('Помилка входу', error.message);
        throw error;
      }
      
      console.log('AuthProvider: Успішний вхід');
      return data;
    } catch (error: any) {
      console.error('AuthProvider: Виключення при вході:', error.message);
      Alert.alert(
        'Помилка входу',
        'Не вдалося увійти. Перевірте електронну пошту та пароль.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('AuthProvider: Спроба виходу');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Помилка виходу:', error.message);
        throw error;
      }
      
      console.log('AuthProvider: Успішний вихід');
      setUser(null);
    } catch (error: any) {
      console.error('AuthProvider: Виключення при виході:', error.message);
      Alert.alert(
        'Помилка виходу',
        'Не вдалося вийти з облікового запису. Будь ласка, спробуйте ще раз.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error: authError,
    signInWithEmail,
    signOut,
  };

  // Для налагодження виведемо стан
  console.log('AuthProvider: Поточний стан -', 
    'user:', user ? 'Авторизований' : 'Не авторизований', 
    'loading:', loading,
    'error:', authError);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
