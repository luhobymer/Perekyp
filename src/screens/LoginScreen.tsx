import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

interface LoginScreenProps {
  navigation?: NativeStackNavigationProp<ParamListBase>;
}

/**
 * Екран авторизації користувача
 */
const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { signInWithGoogle, loading } = useAuth();

  /**
   * Обробник авторизації через Google
   */
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Ласкаво просимо до Perekyp</Text>
        <Text style={styles.subtitle}>
          Увійдіть, щоб почати користуватися додатком
        </Text>

        <Button
          mode="contained"
          onPress={handleGoogleSignIn}
          loading={loading}
          disabled={loading}
          style={styles.googleButton}
          icon="google"
        >
          Увійти через Google
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#4285F4',
  },
});

export default LoginScreen;
