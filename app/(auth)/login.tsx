import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { useAuth } from '../../src/hooks/useAuth';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { supabase, testConnection } from '../../src/services/supabase';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { signIn, signInWithGoogle, resendConfirmation, isLoading, error } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Перевірка з'єднання...");
  const [debugInfo, setDebugInfo] = useState<string>('Завантаження діагностичної інформації...');
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Тестуємо з'єднання при завантаженні компонента
    console.log("Тестуємо з'єднання з Supabase в компоненті login");
    
    // Виводимо інформацію про клієнт для діагностики
    const supabaseInfo = {
      client: !!supabase,
      hasAuth: !!supabase?.auth,
      hasFrom: !!supabase?.from
    };
    
    setDebugInfo(`Діагностика: Client=${supabaseInfo.client}, Auth=${supabaseInfo.hasAuth}, From=${supabaseInfo.hasFrom}`);
    
    // Проводимо оновлену перевірку з'єднання
    const checkConnection = async () => {
      try {
        setConnectionStatus(`Перевірка з'єднання...`);
        // Використовуємо тестову функцію з TypeScript файлу
        const result = await testConnection();
        
        if (!result.success) {
          console.error('Помилка підключення:', result.error);
          setConnectionStatus(`Помилка підключення: ${result.error?.message || 'Невідома помилка'} (URL: ${result.url})`);
        } else {
          console.log('Успішне підключення, отримано дані:', result.data);
          setConnectionStatus(`Підключення успішне до ${result.url}`);
        }
      } catch (err) {
        console.error('Сталася помилка при тестуванні підключення:', err);
        setConnectionStatus(`Сталася помилка: ${err instanceof Error ? err.message : 'Невідома помилка'}`);
      }
    };
    
    checkConnection();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Введіть електронну пошту та пароль');
      return;
    }
    
    setLoginError(null);
    console.log('Початок входу в систему з email:', email);
    
    try {
      console.log('Виклик signIn...');
      const success = await signIn(email, password);
      
      if (success) {
        console.log('Вхід успішний!');
        // Перенаправляємо користувача на головну сторінку додатку
        router.replace('/(tabs)');
      } else {
        console.error('Вхід не вдався');
        setLoginError('Неправильні облікові дані або користувача не існує');
        Alert.alert('Помилка входу', 'Неправильні облікові дані або користувача не існує');
      }
    } catch (err) {
      console.error('Помилка входу:', err);
      const errorMessage = err instanceof Error ? err.message : 'Помилка входу в систему';
      setLoginError(errorMessage);
      
      if (errorMessage.includes('Email not confirmed')) {
        Alert.alert(
          t('auth.email_not_confirmed'), 
          t('auth.email_not_confirmed_message'),
          [
            {
              text: t('auth.resend_confirmation'),
              onPress: async () => {
                try {
                  const result = await resendConfirmation(email);
                  
                  if (!result.success) {
                    console.error('Помилка повторного відправлення:', result.error);
                    Alert.alert('Помилка', result.error || 'Невідома помилка');
                  } else {
                    Alert.alert('', t('auth.confirmation_resent'));
                  }
                } catch (err) {
                  console.error('Помилка:', err);
                  Alert.alert('Помилка', err instanceof Error ? err.message : 'Невідома помилка');
                }
              }
            },
            { text: 'OK' }
          ]
        );
      } else if (errorMessage.includes('Користувача не знайдено в системі')) {
        Alert.alert(t('auth.user_deleted'), t('auth.user_deleted_message'));
      } else {
        Alert.alert('Помилка входу', errorMessage);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Початок входу через Google...');
      await signInWithGoogle();
      console.log('OAuth запит відправлено');
    } catch (err) {
      console.error('Помилка входу через Google:', err);
      setLoginError('Помилка входу через Google: ' + (err instanceof Error ? err.message : 'Невідома помилка'));
      Alert.alert('Помилка входу через Google', err instanceof Error ? err.message : 'Невідома помилка');
    }
  };

  const testDirectConnection = async () => {
    try {
      setConnectionStatus("Тестування прямого підключення...");
      // Оновлюємо URL прямого запиту
      const url = 'https://kjnbhiyrxtdaohxssynx.supabase.co';
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbmJoaXlyeHRkYW9oeHNzeW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA2MTUsImV4cCI6MjA1OTk1NjYxNX0.x7nrtynaPcDWCOffcWJNrZkhTXNPokvTZ9NtpnFJ9FY';
      
      console.log('Тестування URL:', url);
      const response = await fetch(`${url}/rest/v1/cars?select=count`, {
        method: 'GET',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Прямий запит статус:', response.status);
      const data = await response.json();
      console.log('Прямий запит результат:', data);
      setConnectionStatus(`Підключення успішне. Статус: ${response.status}`);
      setDebugInfo(`Прямий тест: URL=${url}, Статус=${response.status}, Дані=${JSON.stringify(data)}`);
      Alert.alert('Тест підключення', JSON.stringify(data));
    } catch (err) {
      console.error('Помилка прямого запиту:', err);
      setConnectionStatus(`Помилка підключення: ${err instanceof Error ? err.message : 'Невідома помилка'}`);
      setDebugInfo(`Помилка прямого запиту: ${err instanceof Error ? err.message : 'Невідома помилка'}`);
      Alert.alert('Помилка тесту', err instanceof Error ? err.message : 'Невідома помилка');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={[styles.appName, { color: colors.primary }]}>Перекуп</Text>
            <Text style={[styles.slogan, { color: colors.text }]}>
              Керуйте своїм автобізнесом ефективно
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.connectionStatus, { 
              color: connectionStatus.includes('успішне') ? 'green' : 
                    connectionStatus.includes('Помилка') ? 'red' : colors.text 
            }]}>
              {connectionStatus}
            </Text>
            
            <Text style={[styles.debugInfo, { color: colors.textSecondary }]}>
              {debugInfo}
            </Text>
            
            <Input
              label="Електронна пошта"
              value={email}
              onChangeText={setEmail}
              placeholder="Введіть вашу електронну пошту"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Пароль"
              value={password}
              onChangeText={setPassword}
              placeholder="Введіть ваш пароль"
              secureTextEntry
            />
            {loginError && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {loginError}
              </Text>
            )}
            <Button
              title="Увійти"
              onPress={handleLogin}
              loading={isLoading}
              type="primary"
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>або</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <TouchableOpacity 
              style={[styles.googleButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text style={[styles.googleButtonText, { color: colors.text }]}>
                Увійти через Google
              </Text>
            </TouchableOpacity>

            <Button
              title="Перевірити підключення"
              onPress={testDirectConnection}
              type="outline"
              style={{ marginTop: 16 }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Ще немає облікового запису?
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.registerLink, { color: colors.primary }]}>
                  Зареєструватися
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  connectionStatus: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  debugInfo: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 12,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 