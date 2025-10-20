import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AddCarScreen from '../../src/screens/cars/AddCarScreen';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useTheme } from '../../src/hooks/useTheme';

export default function AddCar() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('add_car', 'Додати авто'),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <AnimatedScreen transition="slideUp" duration={400}>
        <AddCarScreen />
      </AnimatedScreen>
    </>
  );
}

const styles = StyleSheet.create({}); 