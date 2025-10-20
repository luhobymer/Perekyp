import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '../../../src/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useCars } from '../../../src/hooks/useCars';
import { useOfflineStorage } from '../../../src/hooks/useOfflineStorage';
import Button from '../../../src/components/Button';
import AnimatedScreen from '../../../components/AnimatedScreen';
import LoadingIndicator from '../../../src/components/LoadingIndicator';

export default function DeleteCar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [car, setCar] = useState(null);
  
  const { deleteCar, getCar } = useCars();
  const { deleteItem } = useOfflineStorage('cars');
  
  useEffect(() => {
    const loadCar = async () => {
      if (id) {
        const carData = await getCar(id);
        setCar(carData);
      }
    };
    
    loadCar();
  }, [id, getCar]);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCar(id);
      await deleteItem(id);
      setIsDeleting(false);
      router.replace('/cars');
    } catch (error) {
      console.error('Помилка видалення авто:', error);
      setIsDeleting(false);
      Alert.alert(
        t('error', 'Помилка'),
        t('delete_car_error', 'Не вдалося видалити автомобіль. Спробуйте ще раз.')
      );
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  if (!car) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: t('delete_car', 'Видалення авто'),
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
        <LoadingIndicator />
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('delete_car', 'Видалення авто'),
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('delete_car_confirmation', 'Видалити автомобіль?')}
          </Text>
          
          <Text style={[styles.carInfo, { color: theme.colors.text }]}>
            {car.brand} {car.model} {car.year}
          </Text>
          
          <Text style={[styles.warning, { color: theme.colors.error }]}>
            {t('delete_car_warning', 'Ця дія не може бути скасована. Всі дані, пов\'язані з цим автомобілем, будуть видалені.')}
          </Text>
          
          <View style={styles.buttonsContainer}>
            <Button
              title={t('cancel', 'Скасувати')}
              onPress={handleCancel}
              type="secondary"
              style={[styles.button, styles.cancelButton]}
              disabled={isDeleting}
            />
            <Button
              title={isDeleting ? t('deleting', 'Видалення...') : t('delete', 'Видалити')}
              onPress={handleDelete}
              type="danger"
              style={styles.button}
              loading={isDeleting}
            />
          </View>
        </View>
      </AnimatedScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  carInfo: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  cancelButton: {
    borderWidth: 1,
  },
}); 