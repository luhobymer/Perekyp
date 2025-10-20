import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

// Перевіряємо, чи код виконується в браузері
const isBrowser = typeof window !== 'undefined';

// Попередження WebBrowser лише якщо ми в браузері
if (isBrowser) {
  WebBrowser.maybeCompleteAuthSession();
}

interface GoogleAuthResult {
  signInWithGoogle: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export const useGoogleAuth = (): GoogleAuthResult => {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Для тестування без реальних ключів Google
  const requestConfig = {
    clientId: 'mock-client-id-for-testing',
    redirectUri: 'https://auth.expo.io/@anonymous/perekypapp',
  };

  // Використовуємо умовний хук для запобігання помилок під час серверного рендерингу
  const [request, response, promptAsync] = isBrowser 
    ? Google.useAuthRequest(requestConfig) 
    : [null, null, async () => { console.log('Auth request not available during server rendering'); }];

  useEffect(() => {
    if (isBrowser && response?.type === 'success') {
      handleTestGoogleSignIn();
    }
  }, [response]);

  // Функція для тестування без реального Google API
  const handleTestGoogleSignIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Симулюємо успішний вхід через Supabase
      setTimeout(() => {
        setIsLoading(false);
        // Викликаємо метод входу з Mock даними
        signIn('test@gmail.com', 'password');
      }, 1000);
    } catch (error) {
      setError('Помилка входу через Google');
      console.error('Google sign in error:', error);
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isBrowser && promptAsync) {
        await promptAsync();
      } else {
        // Для серверного рендерингу, імітуємо успішний вхід
        setTimeout(() => {
          handleTestGoogleSignIn();
        }, 500);
      }
    } catch (error) {
      setError('Помилка запуску Google авторизації');
      console.error('Google prompt error:', error);
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    error,
    isLoading,
  };
}; 

export default useGoogleAuth;
