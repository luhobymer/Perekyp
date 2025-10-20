import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { RegisterScreenProps } from '../../types/screens/auth/RegisterScreen';

/**
 * Екран реєстрації нового користувача
 * 
 * @component
 * @example
 * return (
 *   <RegisterScreen />
 * )
 */
const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister: externalOnRegister,
  onNavigateToLogin: externalOnNavigateToLogin,
  isLoading: externalIsLoading,
  error: externalError,
  containerStyle,
  contentStyle,
  titleStyle,
  inputStyle,
  buttonStyle,
  buttonTextStyle,
  linkButtonStyle,
  errorTextStyle,
  emailInputProps,
  passwordInputProps,
  confirmPasswordInputProps,
  renderForm,
  renderRegisterButton,
  renderLoginLink,
  renderError,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { signUp: contextSignUp, loading: contextLoading } = useAuth();
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isLoading = externalIsLoading ?? contextLoading ?? isSubmitting;
  const error = externalError;

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      Alert.alert(t('auth.passwords_do_not_match'));
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (externalOnRegister) {
        await externalOnRegister(email, password);
      } else if (contextSignUp) {
        await contextSignUp(email, password);
      }
      
      Alert.alert(t('auth.registration_successful'));
      
      if (externalOnNavigateToLogin) {
        externalOnNavigateToLogin();
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('auth.registration_failed');
      Alert.alert(t('auth.registration_failed'), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, confirmPassword, t, externalOnRegister, contextSignUp, externalOnNavigateToLogin, navigation]);

  const handleNavigateToLogin = useCallback(() => {
    if (externalOnNavigateToLogin) {
      externalOnNavigateToLogin();
    } else {
      navigation.navigate('Login');
    }
  }, [externalOnNavigateToLogin, navigation]);

  // Стандартний рендер форми
  const renderDefaultForm = () => (
    <>
      <Text 
        style={[
          styles.title, 
          { color: theme.colors.text },
          titleStyle
        ]}
        variant="headlineSmall"
      >
        {t('auth.register')}
      </Text>
      
      <TextInput
        {...emailInputProps}
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        style={[styles.input, inputStyle]}
        mode="outlined"
        left={<TextInput.Icon icon="email" />}
        disabled={isLoading}
      />
      
      <TextInput
        {...passwordInputProps}
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        style={[styles.input, inputStyle]}
        mode="outlined"
        left={<TextInput.Icon icon="lock" />}
        disabled={isLoading}
      />
      
      <TextInput
        {...confirmPasswordInputProps}
        label={t('auth.confirm_password')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        style={[styles.input, inputStyle]}
        mode="outlined"
        left={<TextInput.Icon icon="lock-check" />}
        disabled={isLoading}
        onSubmitEditing={handleRegister}
      />
    </>
  );

  // Стандартний рендер кнопки реєстрації
  const renderDefaultRegisterButton = () => (
    <Button
      mode="contained"
      onPress={handleRegister}
      loading={isLoading}
      disabled={isLoading || !email || !password || !confirmPassword}
      style={[styles.button, buttonStyle]}
      contentStyle={styles.buttonContent}
    >
      <Text style={[styles.buttonText, buttonTextStyle]}>
        {t('auth.register')}
      </Text>
    </Button>
  );

  // Стандартний рендер посилання на вхід
  const renderDefaultLoginLink = () => (
    <Button
      mode="text"
      onPress={handleNavigateToLogin}
      disabled={isLoading}
      style={styles.loginLink}
      textColor={theme.colors.primary}
    >
      {t('auth.already_have_account')} {t('auth.sign_in')}
    </Button>
  );

  // Стандартний рендер помилки
  const renderDefaultError = (errorMessage: string) => (
    <Text 
      style={[
        styles.errorText, 
        { color: theme.colors.error },
        errorTextStyle
      ]}
      variant="bodySmall"
    >
      {errorMessage}
    </Text>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {renderForm ? renderForm({
              email,
              onEmailChange: setEmail,
              password,
              onPasswordChange: setPassword,
              confirmPassword,
              onConfirmPasswordChange: setConfirmPassword,
              onSubmit: handleRegister,
              isLoading,
              error: error || null,
            }) : renderDefaultForm()}
            
            {error && (renderError ? renderError(error) : renderDefaultError(error))}
            
            {renderRegisterButton 
              ? renderRegisterButton({
                  onPress: handleRegister,
                  disabled: isLoading || !email || !password || !confirmPassword,
                  loading: isLoading,
                })
              : renderDefaultRegisterButton()
            }
            
            {renderLoginLink 
              ? renderLoginLink({ onPress: handleNavigateToLogin })
              : renderDefaultLoginLink()
            }
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RegisterScreen;
