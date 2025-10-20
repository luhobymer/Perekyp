/**
 * Типи для автентифікації
 */

// Модель користувача
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

// Дані для входу
export interface LoginCredentials {
  email: string;
  password: string;
}

// Дані для реєстрації
export interface RegisterData extends LoginCredentials {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Відповідь автентифікації
export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

// Стан автентифікації
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Дії автентифікації
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}
