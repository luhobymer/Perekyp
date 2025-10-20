import React from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AnimatedScreen from '../../../components/AnimatedScreen';
import AddCarScreen from '../../../src/screens/cars/AddCarScreen';
import { useTheme } from '../../../src/hooks/useTheme';

export default function EditCar() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('edit_car', 'Редагування авто'),
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
      <AnimatedScreen transition="slideLeft" duration={400}>
        <AddCarScreen 
          carId={id} 
          isEditMode={true} 
          screenTitle="edit_car" 
        />
      </AnimatedScreen>
    </>
  );
}

const styles = StyleSheet.create({}); 