import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Константи
const BIOMETRICS_ENABLED_KEY = '@biometrics_enabled';

// Типи для біометрії
export interface BiometricsHook {
  isBiometricsAvailable: boolean;
  isBiometricsEnabled: boolean;
  error: string | null;
  enableBiometrics: () => Promise<boolean>;
  disableBiometrics: () => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

export const useBiometrics = (): BiometricsHook => {
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState<boolean>(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricsAvailability();
    loadBiometricsPreference();
  }, []);

  const checkBiometricsAvailability = async (): Promise<void> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricsAvailable(hasHardware && isEnrolled);
    } catch (error) {
      setError('Помилка перевірки біометрії');
      console.error('Error checking biometrics:', error);
    }
  };

  const loadBiometricsPreference = async (): Promise<void> => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
      setIsBiometricsEnabled(enabled === 'true');
    } catch (error) {
      setError('Помилка завантаження налаштувань біометрії');
      console.error('Error loading biometrics preference:', error);
    }
  };

  const enableBiometrics = async (): Promise<boolean> => {
    try {
      if (!isBiometricsAvailable) {
        throw new Error('Біометрія недоступна на цьому пристрої');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Підтвердіть свою особу',
        fallbackLabel: 'Використати пароль',
      });

      if (result.success) {
        await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, 'true');
        setIsBiometricsEnabled(true);
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка вмикання біометрії');
      console.error('Error enabling biometrics:', error);
      return false;
    }
  };

  const disableBiometrics = async (): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, 'false');
      setIsBiometricsEnabled(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка вимкнення біометрії');
      console.error('Error disabling biometrics:', error);
      return false;
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      if (!isBiometricsEnabled) {
        throw new Error('Біометрія не увімкнена');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Підтвердіть свою особу',
        fallbackLabel: 'Використати пароль',
      });

      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка біометричної автентифікації');
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  };

  return {
    isBiometricsAvailable,
    isBiometricsEnabled,
    error,
    enableBiometrics,
    disableBiometrics,
    authenticateWithBiometrics,
  };
}; 

export default useBiometrics;
