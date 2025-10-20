import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import CarDetailsScreen from '../../src/screens/cars/CarDetailsScreen';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useCars } from '../../src/hooks/useCars';
import { useTheme } from '../../src/hooks/useTheme';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import Button from '../../src/components/Button';

export default function CarDetails() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { getCar, loading } = useCars();
  const { theme } = useTheme();
  const [carTitle, setCarTitle] = useState('');
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [carData, setCarData] = useState(null);
  
  useEffect(() => {
    const loadCarData = async () => {
      try {
        if (!id) {
          throw new Error('ID автомобіля не вказаний');
        }
        
        console.log('Завантажуємо автомобіль з ID:', id);
        const car = await getCar(id as string);
        
        if (!car) {
          throw new Error('Автомобіль не знайдено');
        }
        
        setCarData(car);
        setCarTitle(`${car.brand} ${car.model}`);
        setLoadError(null);
      } catch (error) {
        console.error('Помилка завантаження даних автомобіля:', error);
        setLoadError(error instanceof Error ? error : new Error('Невідома помилка'));
      }
    };
    
    loadCarData();
  }, [id, getCar]);
  
  if (loading) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: t('car_details', 'Деталі авто'),
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
          }} 
        />
        <AnimatedScreen>
          <LoadingIndicator />
        </AnimatedScreen>
      </>
    );
  }
  
  if (loadError) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: t('error', 'Помилка'),
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
          }} 
        />
        <AnimatedScreen>
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {loadError.message}
            </Text>
            <Button 
              title={t('common.back_to_list', 'Повернутися до списку')}
              onPress={() => router.back()}
              type="primary"
              style={styles.backButton}
            />
          </View>
        </AnimatedScreen>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: carTitle || t('car_details', 'Деталі авто'),
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
        {carData ? (
          <CarDetailsScreen carId={id as string} initialData={carData} />
        ) : (
          <LoadingIndicator />
        )}
      </AnimatedScreen>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    minWidth: 200,
  }
}); 