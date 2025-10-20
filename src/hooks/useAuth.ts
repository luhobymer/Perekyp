import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { User } from '@supabase/supabase-js';

// Розширений тип для контексту автентифікації
export interface AuthContextType {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ success: boolean, error?: string }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean, error?: string }>;
  error: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context as AuthContextType;
}; 