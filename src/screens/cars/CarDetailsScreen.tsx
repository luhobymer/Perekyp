import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Car } from '../../types/cars';
import { CarInfoProps } from '../../types/components/CarInfo';
import { useTheme } from '../../hooks/useTheme';
import { useOfflineStorage } from '../../hooks/useOfflineStorage';
import { useCars } from '../../hooks/useCars';
import CarInfo from '../../components/CarInfo';
import ExpensesList from '../../components/ExpensesList';
import DocumentsList from '../../components/DocumentsList';
import Button from '../../components/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorMessage from '../../components/ErrorMessage';

type CarDetailsScreenParams = {
  carId: string;
};

type CarDetailsScreenRouteProp = RouteProp<{ params: CarDetailsScreenParams }, 'params'>;

interface CarDetailsScreenProps {
  carId?: string;
  initialData?: Car | null;
}

const CarDetailsScreen: React.FC<CarDetailsScreenProps> = ({ carId, initialData }) => {
  const route = useRoute<CarDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const router = useRouter();
  const { theme } = useTheme();
  const carIdFromRoute = route.params?.carId;
  
  // Використовуємо carId з пропсів або з параметрів маршруту
  const actualCarId = carId || carIdFromRoute;

  const {
    data: offlineCar,
    isLoading: isOfflineLoading,
    error: offlineError,
    updateItem: updateOfflineCar
  } = useOfflineStorage<Car>('cars');

  const {
    getCar,
    updateCar,
    isLoading: isOnlineLoading,
    error: onlineError
  } = useCars();

  const [car, setCar] = useState<Car | null>(initialData || null);
  
  // Додаємо пусту функцію onUpdate для CarInfo
  const handleCarUpdate = (updates: Partial<Car>) => {
    if (!car) return;
    setCar({ ...car, ...updates });
  };
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Якщо є initialData, використовуємо їх замість завантаження
    if (initialData) {
      setCar(initialData);
      setLoading(false);
      return;
    }
    
    const loadCar = async () => {
      if (!actualCarId) {
        console.error('Car ID is missing');
        setError('Ідентифікатор автомобіля відсутній');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Loading car with ID:', actualCarId);
        const carData = await getCar(actualCarId);
        
        if (!carData) {
          throw new Error('Автомобіль не знайдено');
        }
        
        setCar(carData);
        setError(null);
      } catch (err) {
        console.error('Error loading car:', err);
        setError(err.message || 'Помилка завантаження автомобіля');
      } finally {
        setLoading(false);
      }
    };
    
    loadCar();
  }, [actualCarId, getCar, initialData]);

  const handleUpdateCar = async (updates: Partial<Car>) => {
    try {
      if (!actualCarId) {
        console.error('Car ID is missing');
        return;
      }
      // Оновлюємо онлайн дані
      await updateCar(actualCarId, updates);
      // Оновлюємо офлайн дані
      await updateOfflineCar(actualCarId, updates);
      // Оновлюємо локальний стан
      setCar(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  if (loading || isOfflineLoading || isOnlineLoading) {
    return <LoadingIndicator />;
  }

  if (!actualCarId) {
    return <ErrorMessage message="Ідентифікатор автомобіля відсутній" />;
  }

  if (error || offlineError || onlineError || !car) {
    return <ErrorMessage message={error || offlineError?.message || onlineError?.message || 'Автомобіль не знайдено'} />;
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <CarInfo 
        car={car} 
        onEditPress={() => router.push(`/cars/edit/${actualCarId}`)}
        onUpdate={handleCarUpdate}
      />
      
      <View style={styles.section}>
        <ExpensesList carId={actualCarId} />
      </View>

      <View style={styles.section}>
        <DocumentsList carId={actualCarId} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Редагувати"
          onPress={() => router.push(`/cars/edit/${actualCarId}`)}
          type="primary"
          style={styles.button}
        />
        <Button
          title="Видалити"
          onPress={() => router.push(`/cars/delete/${actualCarId}`)}
          type="danger"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CarDetailsScreen;
