import { User } from './auth';
import { ReactNode } from 'react';

/**
 * Типи для контексту автентифікації
 */

/**
 * Інтерфейс контексту автентифікації
 */
export interface AuthContextType {
  /**
   * Поточний користувач
   */
  user: User | null;
  
  /**
   * Чи відбувається завантаження
   */
  loading: boolean;
  
  /**
   * Помилка автентифікації
   */
  error: string | null;
  
  /**
   * Вхід за допомогою email та пароля
   * @param email - електронна пошта
   * @param password - пароль
   */
  signInWithEmail: (email: string, password: string) => Promise<any>;
  
  /**
   * Вихід з системи
   */
  signOut: () => Promise<void>;
}

/**
 * Пропси для провайдера автентифікації
 */
export interface AuthProviderProps {
  /**
   * Дочірні компоненти
   */
  children: ReactNode;
}
