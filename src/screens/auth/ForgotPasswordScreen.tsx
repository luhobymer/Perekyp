import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import Button from '../../components/Button';
import { SIZES, FONTS } from '../../constants/theme';
import { ForgotPasswordScreenProps, ForgotPasswordFormData, PasswordResetStatus } from '../../types/screens/forgotPassword';
import { supabase } from '../../services/supabase';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Стан форми
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  
  // Стан відправки запиту
  const [status, setStatus] = useState<PasswordResetStatus>(PasswordResetStatus.IDLE);
  
  // Валідація форми
  const [errors, setErrors] = useState<{
    email?: string;
  }>({});
  
  // Обробка зміни полів форми
  const handleChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаємо помилки при зміні поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // Валідація форми
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
    } = {};
    
    // Валідація email
    if (!formData.email) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Відправка запиту на відновлення паролю
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setStatus(PasswordResetStatus.SUBMITTING);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: 'https://perekyp.app/reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      setStatus(PasswordResetStatus.SUCCESS);
      Alert.alert(
        t('success'),
        t('reset_password_email_sent'),
        [
          { 
            text: t('ok'), 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus(PasswordResetStatus.ERROR);
      Alert.alert(
        t('error'),
        t('reset_password_error'),
        [{ text: t('ok') }]
      );
    }
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: theme.colors.background }
    ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={[
              styles.title, 
              { color: theme.colors.text }
            ]}>
              {t('forgot_password')}
            </Text>
            <Text style={[
              styles.subtitle, 
              { color: theme.colors.textSecondary }
            ]}>
              {t('forgot_password_subtitle', { defaultValue: 'Відновлення доступу до облікового запису' })}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                {t('email')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    borderColor: errors.email ? theme.colors.error : theme.colors.border
                  }
                ]}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder={t('enter_email')}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.email}
                </Text>
              )}
            </View>
            
            <Button
              title={status === PasswordResetStatus.SUBMITTING ? t('sending') : t('send_reset_link')}
              onPress={handleSubmit}
              disabled={status === PasswordResetStatus.SUBMITTING}
              style={styles.button}
            />
            
            <Button
              title={t('back')}
              onPress={() => navigation.goBack()}
              type="outline"
              style={styles.button}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.large,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.medium,
    marginBottom: SIZES.xxl,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: FONTS.sizes.medium,
    marginBottom: SIZES.xsmall,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    fontSize: FONTS.sizes.medium,
  },
  errorText: {
    fontSize: FONTS.sizes.small,
    marginTop: SIZES.xsmall,
  },
  button: {
    width: '100%',
    marginTop: SIZES.medium,
  },
});

export default ForgotPasswordScreen;
