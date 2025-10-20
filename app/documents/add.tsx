import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
// Використовуємо стандартний компонент з React Native
import { Platform } from 'react-native';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useCars } from '../../src/hooks/useCars';

export default function AddDocumentScreen() {
  const { t } = useTranslation();
  const { getCars } = useCars();
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('passport');
  const [selectedCar, setSelectedCar] = useState<any>(null);
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

  const handleAddDocument = async () => {
    if (!documentName.trim()) {
      Alert.alert(t('errors.title'), t('documents.errors.nameRequired'));
      return;
    }

    if (!selectedCar) {
      Alert.alert(t('errors.title'), t('errors.selectCar'));
      return;
    }

    setLoading(true);
    try {
      // Тут буде логіка додавання документу до бази даних
      // await addDocument({ name: documentName, type: documentType, carId: selectedCar.id });
      
      // Імітація затримки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        t('success.title'),
        t('documents.success.added'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Помилка додавання документу:', error);
      Alert.alert(t('errors.title'), t('documents.errors.adding'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <Stack.Screen
        options={{
          title: t('documents.addTitle', 'Додати документ'),
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{t('documents.name', 'Назва документу')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('documents.namePlaceholder', 'Введіть назву документу')}
            value={documentName}
            onChangeText={setDocumentName}
          />

          <Text style={styles.sectionTitle}>{t('documents.type', 'Тип документу')}</Text>
          <View style={styles.pickerContainer}>
            {/* Замість Picker використовуємо кнопки для вибору типу документа */}
            <View style={styles.typeButtonsContainer}>
              {[
                { label: t('documents.types.passport', 'Технічний паспорт'), value: 'passport' },
                { label: t('documents.types.insurance', 'Страховка'), value: 'insurance' },
                { label: t('documents.types.contract', 'Договір купівлі-продажу'), value: 'contract' },
                { label: t('documents.types.act', 'Акт передачі'), value: 'act' },
                { label: t('documents.types.other', 'Інше'), value: 'other' }
              ].map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    documentType === type.value && styles.selectedTypeButton
                  ]}
                  onPress={() => setDocumentType(type.value)}
                >
                  <Text 
                    style={[
                      styles.typeButtonText,
                      documentType === type.value && styles.selectedTypeButtonText
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t('documents.selectCar', 'Вибрати автомобіль')}</Text>
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
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleAddDocument}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('common.loading') : t('documents.addButton', 'Додати документ')}
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
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    marginRight: 8,
    minWidth: '48%',
  },
  selectedTypeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  selectedCarItemText: {
    color: '#FFFFFF',
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
