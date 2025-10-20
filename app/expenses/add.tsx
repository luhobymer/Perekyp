import React from 'react';
import { StyleSheet } from 'react-native';
import AddExpenseScreen from '../../src/screens/expenses/AddExpenseScreen';
import AnimatedScreen from '../../components/AnimatedScreen';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

export default function AddExpense() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const navigation = {
    navigate: (screen: string, params: any) => {
      if (screen === 'CarExpenses') {
        router.navigate(`/cars/${params.carId}?tab=expenses`);
      } else {
        router.navigate(`/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return (
    <ThemeProvider>
      <AnimatedScreen transition="slideUp" duration={400}>
        <Stack.Screen 
          options={{ 
            title: t('add_expense', 'Додати витрату'),
            headerShown: true
          }} 
        />
        <AddExpenseScreen route={{ params }} navigation={navigation} />
      </AnimatedScreen>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({}); 