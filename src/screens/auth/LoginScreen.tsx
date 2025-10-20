import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { LoginScreenProps } from '../../types/screens/auth/LoginScreen';

/**
 * Екран входу в додаток
 * 
 * @component
 * @example
 * return (
 *   <LoginScreen />
 * )
 */
const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoogleSignIn: externalOnGoogleSignIn,
  isLoading: externalIsLoading,
  error: externalError,
  containerStyle,
  contentStyle,
  logoStyle,
  titleStyle,
  subtitleStyle,
  buttonStyle,
  buttonTextStyle,
  errorTextStyle,
  renderLogo,
  renderTitle,
  renderSubtitle,
  renderLoginButton,
  renderError,
}) => {
  const { signInWithGoogle: contextSignIn, loading: contextLoading } = useAuth();
  const { theme } = useTheme();

  const isLoading = externalIsLoading ?? contextLoading;
  const error = externalError;

  const handleGoogleSignIn = async () => {
    try {
      if (externalOnGoogleSignIn) {
        await externalOnGoogleSignIn();
      } else {
        await contextSignIn();
      }
    } catch (error) {
      console.error('Помилка входу через Google:', error);
    }
  };

  // Стандартний рендер логотипу
  const renderDefaultLogo = () => (
    <Image
      source={require('../../assets/logo.png') as ImageSourcePropType}
      style={[styles.logo, logoStyle]}
      resizeMode="contain"
      accessibilityLabel="Логотип Perekyp"
    />
  );

  // Стандартний рендер заголовка
  const renderDefaultTitle = () => (
    <Text style={[styles.title, titleStyle]} variant="headlineMedium">
      Ласкаво просимо до Perekyp
    </Text>
  );

  // Стандартний рендер підзаголовка
  const renderDefaultSubtitle = () => (
    <Text style={[styles.subtitle, subtitleStyle]} variant="bodyMedium">
      Увійдіть, щоб почати користуватися додатком
    </Text>
  );

  // Стандартний рендер кнопки входу
  const renderDefaultLoginButton = () => (
    <Button
      mode="contained"
      onPress={handleGoogleSignIn}
      loading={isLoading}
      disabled={isLoading}
      style={[styles.googleButton, buttonStyle]}
      contentStyle={styles.buttonContent}
      icon="google"
      accessibilityLabel="Увійти через Google"
    >
      <Text style={[styles.buttonText, buttonTextStyle]}>Увійти через Google</Text>
    </Button>
  );

  // Стандартний рендер помилки
  const renderDefaultError = (errorMessage: string) => (
    <Text style={[styles.errorText, errorTextStyle]} variant="bodySmall">
      {errorMessage}
    </Text>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }, containerStyle]}
      testID="login-screen"
    >
      <View style={[styles.content, contentStyle]}>
        {renderLogo ? renderLogo() : renderDefaultLogo()}
        
        {renderTitle ? renderTitle() : renderDefaultTitle()}
        
        {renderSubtitle ? renderSubtitle() : renderDefaultSubtitle()}
        
        {renderLoginButton 
          ? renderLoginButton({
              onPress: handleGoogleSignIn,
              loading: isLoading,
              disabled: isLoading,
            })
          : renderDefaultLoginButton()
        }
        
        {error && (renderError ? renderError(error) : renderDefaultError(error))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  googleButton: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
