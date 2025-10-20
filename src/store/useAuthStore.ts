import { create } from 'zustand';
import { AuthState, AuthActions, LoginCredentials, RegisterData, User } from '../types/auth';
import { supabase } from '../services/supabase';

/**
 * Стор для управління станом автентифікації
 */
const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // Початковий стан
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Вхід користувача
   * @param credentials - дані для входу
   */
  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      // Отримуємо додаткові дані користувача з таблиці profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Помилка отримання профілю:', profileError);
      }
      
      // Об'єднуємо дані автентифікації з профілем
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        avatar: profileData?.avatar_url,
        phone: profileData?.phone,
        role: profileData?.role,
        createdAt: data.user.created_at,
        updatedAt: profileData?.updated_at || data.user.created_at,
      };
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Помилка входу:', error.message);
      set({ 
        error: error.message || 'Помилка входу', 
        isLoading: false 
      });
    }
  },

  /**
   * Реєстрація нового користувача
   * @param data - дані для реєстрації
   */
  register: async (data: RegisterData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      if (authData.user) {
        // Створюємо запис у таблиці profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone,
              avatar_url: null,
              role: 'user',
              updated_at: new Date().toISOString(),
            }
          ]);
        
        if (profileError) {
          console.error('Помилка створення профілю:', profileError);
        }
        
        // Об'єднуємо дані автентифікації з профілем
        const userData: User = {
          id: authData.user.id,
          email: authData.user.email || '',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: 'user',
          createdAt: authData.user.created_at,
          updatedAt: new Date().toISOString(),
        };
        
        set({ 
          user: userData, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        // Якщо потрібне підтвердження email
        set({ 
          isLoading: false,
          error: 'Будь ласка, підтвердіть свою електронну пошту' 
        });
      }
    } catch (error: any) {
      console.error('Помилка реєстрації:', error.message);
      set({ 
        error: error.message || 'Помилка реєстрації', 
        isLoading: false 
      });
    }
  },

  /**
   * Вихід користувача
   */
  logout: async () => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Помилка виходу:', error.message);
      set({ 
        error: error.message || 'Помилка виходу', 
        isLoading: false 
      });
    }
  },

  /**
   * Оновлення профілю користувача
   * @param data - дані для оновлення
   */
  updateProfile: async (data: Partial<User>) => {
    try {
      const currentUser = get().user;
      
      if (!currentUser) {
        throw new Error('Користувач не автентифікований');
      }
      
      set({ isLoading: true, error: null });
      
      // Оновлюємо запис у таблиці profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);
      
      if (profileError) throw profileError;
      
      // Оновлюємо локальний стан
      set({ 
        user: { 
          ...currentUser, 
          ...data,
          updatedAt: new Date().toISOString()
        }, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Помилка оновлення профілю:', error.message);
      set({ 
        error: error.message || 'Помилка оновлення профілю', 
        isLoading: false 
      });
    }
  },

  /**
   * Скидання паролю
   * @param email - електронна пошта для скидання
   */
  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Помилка скидання паролю:', error.message);
      set({ 
        error: error.message || 'Помилка скидання паролю', 
        isLoading: false 
      });
    }
  },

  /**
   * Перевірка автентифікації
   * @returns true, якщо користувач автентифікований
   */
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        // Отримуємо дані користувача
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData.user) {
          // Отримуємо додаткові дані користувача з таблиці profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .single();
          
          if (profileError) {
            console.error('Помилка отримання профілю:', profileError);
          }
          
          // Об'єднуємо дані автентифікації з профілем
          const user: User = {
            id: userData.user.id,
            email: userData.user.email || '',
            firstName: profileData?.first_name,
            lastName: profileData?.last_name,
            avatar: profileData?.avatar_url,
            phone: profileData?.phone,
            role: profileData?.role,
            createdAt: userData.user.created_at,
            updatedAt: profileData?.updated_at || userData.user.created_at,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return true;
        }
      }
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
      
      return false;
    } catch (error: any) {
      console.error('Помилка перевірки автентифікації:', error.message);
      set({ 
        user: null,
        isAuthenticated: false,
        error: error.message || 'Помилка перевірки автентифікації', 
        isLoading: false 
      });
      
      return false;
    }
  },

  /**
   * Очищення помилки
   */
  clearError: () => {
    set({ error: null });
  }
}));

// Додаємо підтримку devtools для дебагу в браузері
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Підключаємо Redux DevTools для дебагу
  const devtoolsExt = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (devtoolsExt) {
    const devtools = devtoolsExt.connect({
      name: 'Auth Store',
    });
    
    // Відправляємо початковий стан
    devtools.init(useAuthStore.getState());
    
    // Підписуємося на зміни стану
    useAuthStore.subscribe((state) => {
      devtools.send('state_updated', state);
    });
  }
}

export default useAuthStore;
