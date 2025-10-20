import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
import { useCars } from '../../src/hooks/useCars';
import AnimatedScreen from '../../components/AnimatedScreen';
import { supabase } from '../../src/services/supabase';

export default function UpdateMileagePage() {
  const { t } = useTranslation();
  const { getCars, updateCar } = useCars();
  
  // Функція для оновлення пробігу
  const updateCarMileage = async (carId: string, mileage: number) => {
    try {
      console.log(`Оновлення пробігу для авто ${carId}: ${mileage} км`);
      
      // Оновлюємо пробіг автомобіля через хук useCars
      const updatedCar = await updateCar(carId, { 
        mileage: mileage,
        updated_at: new Date().toISOString()
      });
      
      // Додаємо запис до історії пробігу
      const { data, error } = await supabase
        .from('mileage_history')
        .insert({
          car_id: carId,
          mileage: mileage,
          date: new Date().toISOString(),
          notes: 'Оновлення пробігу'
        })
        .select();
      
      if (error) {
        console.error('Помилка при додаванні в історію пробігу:', error);
        throw error;
      }
      
      return updatedCar;
    } catch (error) {
      console.error('Помилка при оновленні пробігу:', error);
      throw error;
    }
  };
  
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [mileage, setMileage] = useState('');
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const loadCars = async () => {
      try {
        const carsData = await getCars();
        setCars(carsData || []);
      } catch (error) {
        console.error('Помилка завантаження автомобілів:', error);
        Alert.alert(t('errors.title'), t('errors.loadingCars'));
      }
    };

    loadCars();
  }, [getCars, t]);

  const handleUpdateMileage = async () => {
    if (!selectedCar) {
      Alert.alert(t('errors.title'), t('errors.selectCar'));
      return;
    }

    const newMileage = Number(mileage);
    if (!mileage || isNaN(newMileage)) {
      Alert.alert(t('errors.title'), t('errors.invalidMileage'));
      return;
    }
    
    // Перевіряємо, чи новий пробіг більший за поточний
    if (newMileage <= selectedCar.mileage) {
      Alert.alert(
        t('errors.title'), 
        t('errors.mileageTooLow')
      );
      return;
    }

    setLoading(true);
    try {
      await updateCarMileage(selectedCar.id, newMileage);
      Alert.alert(
        t('success.title'),
        t('success.mileageUpdated'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Помилка оновлення пробігу:', error);
      Alert.alert(t('errors.title'), t('errors.updatingMileage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <Stack.Screen
        options={{
          title: t('mileage.updateTitle'),
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{t('mileage.selectCar')}</Text>
          <View style={styles.carList}>
            {cars.map((car) => (
              <TouchableOpacity
                key={car.id}
                style={[
                  styles.carItem,
                  selectedCar?.id === car.id && styles.selectedCarItem
                ]}
                onPress={() => setSelectedCar(car)}
              >
                <Text style={[
                  styles.carItemText,
                  selectedCar?.id === car.id && styles.selectedCarItemText
                ]}>
                  {car.make} {car.model} ({car.year})
                </Text>
                <Text style={[
                  styles.carItemSubtext,
                  selectedCar?.id === car.id && styles.selectedCarItemText
                ]}>
                  {t('cars.currentMileage')}: {car.mileage} км
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t('mileage.newMileage')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('mileage.enterMileage')}
            keyboardType="numeric"
            value={mileage}
            onChangeText={setMileage}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleUpdateMileage}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('common.loading') : t('mileage.updateButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  carList: {
    marginBottom: 20,
  },
  carItem: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedCarItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  carItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  carItemSubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  selectedCarItemText: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
