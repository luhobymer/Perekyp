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
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase, testConnection } from '../../src/services/supabase';
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const { signUp, isLoading, error } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>(t('checking_connection', "Перевірка з'єднання..."));
  const [debugInfo, setDebugInfo] = useState<string>(t('loading_info', "Завантаження інформації..."));

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setDebugInfo(t('checking_supabase', `Перевірка підключення до Supabase...`));
        // Використовуємо функцію для тестування
        const result = await testConnection();
        
        if (!result.success) {
          console.error('Помилка підключення:', result.error);
          // Тут важливо не звертатися до message, якщо error може бути {}
          const errorMessage = typeof result.error === 'object' && result.error !== null 
            ? (result.error.message || JSON.stringify(result.error)) 
            : String(result.error);
            
          setConnectionStatus(t('connection_error', `Помилка підключення: `) + errorMessage);
          setDebugInfo(`URL: ${result.url}, ${t('error', 'Помилка')}: ${JSON.stringify(result.error)}`);
        } else {
          console.log('Успішне підключення, отримано дані:', result.data);
          setConnectionStatus(t('connection_successful', 'Підключення успішне'));
          setDebugInfo(`URL: ${result.url}, ${t('data', 'Дані')}: ${JSON.stringify(result.data)}`);
        }
      } catch (err) {
        setConnectionStatus(t('connection_check_error', `Помилка перевірки з'єднання: `) + (err instanceof Error ? err.message : t('unknown_error', 'Невідома помилка')));
        setDebugInfo(t('exception', `Виняток: `) + (err instanceof Error ? err.stack : t('unknown_error', 'Невідома помилка')));
      }
    };
    
    checkConnection();
  }, [t]);

  const validateForm = () => {
    console.log('Валідація форми...');
    if (!name || !email || !password || !confirmPassword) {
      setFormError(t('auth.fill_all_fields', 'Будь ласка, заповніть всі поля'));
      return false;
    }
    if (password !== confirmPassword) {
      setFormError(t('passwords_do_not_match', 'Паролі не співпадають'));
      return false;
    }
    if (password.length < 6) {
      setFormError(t('auth.password_too_short', 'Пароль має містити не менше 6 символів'));
      return false;
    }
    console.log('Форма валідна');
    return true;
  };

  const handleRegister = async () => {
    try {
      // Перевірка валідності форми
      if (!validateForm()) {
        return;
      }

      console.log('Початок реєстрації...');
      // Реєстрація користувача через Supabase
      const { success, error } = await signUp(email, password);

      // Якщо є помилка при реєстрації
      if (error) {
        console.error('Помилка реєстрації:', error);
        
        // Відображення помилки користувачу
        Alert.alert(t('registration_failed'), error);
        return;
      }

      // Якщо реєстрація успішна
      if (success) {
        console.log('Реєстрація успішна');
        
        // Оновлюємо ім'я користувача в профілі
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            console.log('Оновлюємо ім\'я користувача в профілі...');
            
            // Перевіряємо, чи існує профіль
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', userData.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error('Помилка перевірки профілю:', profileError);
            }
            
            // Якщо профіль існує - оновлюємо, інакше створюємо
            if (profile) {
              // Оновлюємо профіль
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', userData.user.id);
                
              if (updateError) {
                console.warn('Помилка оновлення імені користувача:', updateError);
              } else {
                console.log('Ім\'я користувача успішно оновлено');
              }
            } else {
              // Створюємо профіль з іменем
              const { error: insertError } = await supabase
                .from('profiles')
                .upsert({
                  id: userData.user.id,
                  email: userData.user.email,
                  full_name: name,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
                
              if (insertError) {
                console.warn('Помилка створення профілю з іменем:', insertError);
              } else {
                console.log('Профіль з іменем успішно створено');
              }
            }
          }
        } catch (updateError) {
          console.error('Помилка під час оновлення профілю:', updateError);
        }
        
        // Спочатку повідомляємо користувача і лише після його підтвердження перенаправляємо
        Alert.alert(
          t('registration_successful'),
          t('email_verification_sent'),
          [{ 
            text: 'OK',
            onPress: () => {
              console.log('Перенаправлення на екран входу після натискання OK...');
              router.push('/(auth)/login');
            }
          }]
        );
      } else {
        console.error('Реєстрація не вдалася з невідомої причини');
        Alert.alert(t('error'), t('registration_failed'));
      }
    } catch (error) {
      console.error('Неочікувана помилка під час реєстрації:', error);
      Alert.alert(t('error'), t('registration_failed'));
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
            <Text style={[styles.title, { color: colors.text }]}>{t('create_account', 'Створення облікового запису')}</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.connectionStatus, { 
              color: connectionStatus.includes(t('connection_successful', 'Підключення успішне')) ? 'green' : 
                    connectionStatus.includes(t('error', 'Помилка')) ? 'red' : colors.text 
            }]}>
              {connectionStatus}
            </Text>
            
            <Text style={[styles.debugInfo, { color: colors.textSecondary }]}>
              {debugInfo}
            </Text>
            
            <Input
              label={t('full_name', "Повне ім'я")}
              value={name}
              onChangeText={setName}
              placeholder={t('enter_name', "Введіть ваше ім'я")}
              autoCapitalize="words"
            />
            <Input
              label={t('email', "Електронна пошта")}
              value={email}
              onChangeText={setEmail}
              placeholder={t('enter_email', "Введіть вашу електронну пошту")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label={t('password', "Пароль")}
              value={password}
              onChangeText={setPassword}
              placeholder={t('enter_password', "Введіть пароль")}
              secureTextEntry
            />
            <Input
              label={t('confirm_password', "Підтвердження пароля")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('repeat_password', "Повторіть пароль")}
              secureTextEntry
            />
            {(formError || error) && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {formError || error}
              </Text>
            )}
            <Button
              title={t('register', "Зареєструватися")}
              onPress={handleRegister}
              loading={isLoading}
              type="primary"
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              {t('already_have_account', "Вже маєте обліковий запис?")}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: colors.primary }]}>
                  {t('login', "Увійти")}
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
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
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
  registerButton: {
    marginTop: 16,
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
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 