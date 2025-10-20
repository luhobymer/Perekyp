import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { CarsStackParamList } from '../types/navigation/carsNavigator';

// Імпорт екранів
import CarsListScreen from '../screens/cars/CarsListScreen';
import AddCarScreen from '../screens/cars/AddCarScreen';
import CarDetailsScreen from '../screens/cars/CarDetailsScreen';
import CarImagesScreen from '../screens/cars/CarImagesScreen';
import CarMileageHistoryScreen from '../screens/cars/CarMileageHistoryScreen';
import CarDocumentsScreen from '../screens/cars/CarDocumentsScreen';
import CarExpensesScreen from '../screens/expenses/CarExpensesScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import SellCarScreen from '../screens/cars/SellCarScreen';

// Створення типізованого стек-навігатора
const Stack = createNativeStackNavigator<CarsStackParamList>();

/**
 * Навігатор для екранів, пов'язаних з автомобілями
 */
const CarsNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="CarsList" 
        component={CarsListScreen} 
        options={{ 
          title: t('my_cars'),
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AddCar" 
        component={AddCarScreen} 
        options={{ 
          title: t('add_car'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="CarDetails" 
        component={CarDetailsScreen} 
        options={({ route }) => ({ 
          title: route.params?.carTitle || t('car_details'),
        })}
      />
      <Stack.Screen 
        name="CarImages" 
        component={CarImagesScreen} 
        options={{ 
          title: t('car_images', { defaultValue: 'Фотографії' }),
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="CarMileageHistory" 
        component={CarMileageHistoryScreen} 
        options={{ 
          title: t('mileage_history', { defaultValue: 'Історія пробігу' }),
        }}
      />
      <Stack.Screen 
        name="CarDocuments" 
        component={CarDocumentsScreen} 
        options={{ 
          title: t('car_documents', { defaultValue: 'Документи автомобіля' }),
        }}
      />
      <Stack.Screen 
        name="CarExpenses" 
        component={CarExpensesScreen} 
        options={{ 
          title: t('car_expenses', { defaultValue: 'Витрати' }),
        }}
      />
      <Stack.Screen 
        name="AddExpense" 
        component={AddExpenseScreen} 
        options={{ 
          title: t('add_expense', { defaultValue: 'Додати витрату' }),
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="SellCar" 
        component={SellCarScreen} 
        options={{ 
          title: t('sell_car', { defaultValue: 'Продати автомобіль' }),
        }}
      />
    </Stack.Navigator>
  );
};

export default CarsNavigator;
