import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import useGallery from '../../hooks/useGallery';
import { FONTS, SIZES } from '../../constants/theme';
import { useCars } from '../../hooks/useCars';
import { CarFormData } from '../../types/cars';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { carBrands } from '../../data/carBrands';
import { engineTypes, bodyTypes, transmissionTypes, colors } from '../../data/carSpecifications';

// Types
interface AddCarScreenProps {
  navigation?: any;
  route?: {
    params?: {
      carId?: string;
      isEditMode?: boolean;
      screenTitle?: string;
      navigation?: any;
    };
  };
}

function AddCarScreen({ route }: AddCarScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { addCar, updateCar, getCar } = useCars();
  const gallery = useGallery();

  const isEditMode = route?.params?.isEditMode || false;
  const carId = route?.params?.carId || '';

  const [formData, setFormData] = useState<CarFormData>(() => ({
    brand: '',
    model: '',
    year: '',
    body_type: '',
    vin: '',
    reg_number: '',
    engine_type: '',
    engine_volume: '',
    color: '',
    mileage: '',
    price: '',
    status: 'active',
    description: '',
    purchase_date: '',
    purchase_price: '',
    last_service_date: '',
    next_service_date: '',
    documents: [],
    expenses: [],
    images: [],
    specifications: {
      transmission: '',
      drive: '',
      fuel: '',
      consumption: {
        city: '',
        highway: '',
        combined: ''
      },
      dimensions: {
        length: '',
        width: '',
        height: '',
        weight: ''
      },
      performance: {
        acceleration: '',
        topSpeed: '',
        horsepower: '',
        torque: ''
      },
      safety: [],
      comfort: [],
      entertainment: [],
      other: []
    }
  }));

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Завантаження даних автомобіля при редагуванні
  const loadCarData = async () => {
    if (isEditMode && carId) {
      setLoading(true);
      try {
        const carData = await getCar(carId);
        if (carData) {
          setFormData({
            brand: carData.brand || '',
            model: carData.model || '',
            year: carData.year?.toString() || '',
            body_type: carData.body_type || '',
            vin: carData.vin || '',
            reg_number: carData.reg_number || '',
            engine_type: carData.engine_type || '',
            engine_volume: carData.engine_volume?.toString() || '',
            color: carData.color || '',
            mileage: carData.mileage?.toString() || '',
            price: carData.price?.toString() || '',
            status: carData.status === 'active' ? 'active' : carData.status === 'sold' ? 'sold' : 'archived',
            description: carData.description || '',
            purchase_date: carData.purchase_date || '',
            purchase_price: carData.purchase_price?.toString() || '',
            last_service_date: carData.last_service_date || '',
            next_service_date: carData.next_service_date || '',
            documents: carData.documents || [],
            expenses: carData.expenses || [],
            images: carData.images || [],
            specifications: {
              transmission: carData.specifications?.transmission || '',
              drive: carData.specifications?.drive || '',
              fuel: carData.specifications?.fuel || '',
              consumption: {
                city: carData.specifications?.consumption?.city || '',
                highway: carData.specifications?.consumption?.highway || '',
                combined: carData.specifications?.consumption?.combined || ''
              },
              dimensions: {
                length: carData.specifications?.dimensions?.length || '',
                width: carData.specifications?.dimensions?.width || '',
                height: carData.specifications?.dimensions?.height || '',
                weight: carData.specifications?.dimensions?.weight || ''
              },
              performance: {
                acceleration: carData.specifications?.performance?.acceleration || '',
                topSpeed: carData.specifications?.performance?.topSpeed || '',
                horsepower: carData.specifications?.performance?.horsepower || '',
                torque: carData.specifications?.performance?.torque || ''
              },
              safety: carData.specifications?.safety || [],
              comfort: carData.specifications?.comfort || [],
              entertainment: carData.specifications?.entertainment || [],
              other: carData.specifications?.other || []
            }
          });
          setSelectedImages(carData.images || []);
        }
      } catch (error) {
        console.error('Помилка завантаження даних автомобіля:', error);
        setError(t('errors.loadingError'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Завантаження даних автомобіля при монтуванні компонента
  useEffect(() => {
    if (isEditMode && carId) {
      loadCarData();
    }
  }, [isEditMode, carId, getCar]);

  // Обробка вибору зображень з галереї
  const handlePickImages = async () => {
    try {
      const result = await gallery.pickImage({
        allowsMultipleSelection: false,
        quality: 0.7
      });
      
      if (!result.cancelled && result.uri) {
        setSelectedImages(prev => [...prev, result.uri]);
        // Оновлюємо також formData.images
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.uri]
        }));
      }
    } catch (error) {
      console.error('Помилка вибору зображень:', error);
      setError(t('errors.imagePickerError'));
    }
  };

  // Видалення зображення
  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    // Також оновлюємо масив зображень у formData
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Обробка зміни значень форми
  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Відправка форми
  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.year) {
      Alert.alert(t('common.error'), t('cars.errors.requiredFields'));
      return;
    }

    try {
      setLoading(true);

      const carData: any = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        body_type: formData.body_type,
        vin: formData.vin,
        reg_number: formData.reg_number,
        engine_type: formData.engine_type,
        engine_volume: formData.engine_volume ? parseFloat(formData.engine_volume) : null,
        color: formData.color,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        price: formData.price ? parseInt(formData.price) : null,
        status: formData.status === 'available' ? 'active' : 
                formData.status === 'sold' ? 'sold' : 'archived',
        description: formData.description,
        purchase_date: formData.purchase_date,
        purchase_price: formData.purchase_price ? parseInt(formData.purchase_price) : null,
        last_service_date: formData.last_service_date,
        next_service_date: formData.next_service_date,
        images: selectedImages,
        specifications: formData.specifications,
        user_id: user?.id,
      };

      if (isEditMode && carId) {
        await updateCar(carId, carData);
        Alert.alert(t('common.success'), t('cars.messages.carUpdated'));
      } else {
        await addCar(carData);
        Alert.alert(t('common.success'), t('cars.messages.carAdded'));
      }

      if (route?.params?.navigation) {
        route.params.navigation.goBack();
      }
    } catch (error) {
      console.error('Помилка при збереженні автомобіля:', error);
      Alert.alert(t('common.error'), t('cars.errors.saveCar'));
    } finally {
      setLoading(false);
    }
  };
  const renderFormField = (
    field: keyof CarFormData,
    label: string,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default',
  ) => {
    return (
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Input
          value={formData[field] as string}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    );
  };

  // Рендер селекта
  const renderSelect = (
    field: keyof CarFormData,
    label: string,
    options: { label: string; value: string }[],
    placeholder: string,
  ) => {
    return (
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Select
          value={formData[field] as string}
          onValueChange={(value) => handleInputChange(field, value)}
          items={options}
          placeholder={placeholder}
          style={styles.select}
        />
      </View>
    );
  };

  // Рендер вибору зображень
  const renderImagePicker = () => {
    return (
      <View style={styles.imagePickerContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{t('cars.images')}</Text>
        <View style={styles.imagesList}>
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={handlePickImages}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Головний рендер компонента
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            {/* Основна інформація */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('cars.basicInfo')}
              </Text>
              {renderSelect(
                'brand',
                t('cars.brand'),
                Object.keys(carBrands).map((brand) => ({ label: brand, value: brand })),
                t('cars.selectBrand')
              )}
              {renderSelect(
                'model',
                t('cars.model'),
                [],
                t('cars.selectModel')
              )}
              {renderFormField('year', t('cars.year'), t('cars.enterYear'), 'numeric')}
              {renderSelect(
                'body_type',
                t('cars.bodyType'),
                bodyTypes.map((type) => ({ label: type, value: type })),
                t('cars.selectBodyType')
              )}
              {renderFormField('vin', t('cars.vin'), t('cars.enterVin'))}
              {renderFormField('reg_number', t('cars.regNumber'), t('cars.enterRegNumber'))}
            </View>

            {/* Технічні характеристики */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('cars.technicalInfo')}
              </Text>
              {renderSelect(
                'engine_type',
                t('cars.engineType'),
                engineTypes.map((type) => ({ label: type, value: type })),
                t('cars.selectEngineType')
              )}
              {renderFormField('engine_volume', t('cars.engineVolume'), t('cars.enterEngineVolume'), 'numeric')}
              {renderSelect(
                'specifications.transmission' as keyof CarFormData,
                t('cars.transmission'),
                transmissionTypes.map((type) => ({ label: type, value: type })),
                t('cars.selectTransmission')
              )}
              {renderFormField('mileage', t('cars.mileage'), t('cars.enterMileage'), 'numeric')}
              {renderSelect(
                'color',
                t('cars.color'),
                colors.map((color) => ({ label: color, value: color })),
                t('cars.selectColor')
              )}
            </View>

            {/* Фінансова інформація */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('cars.financialInfo')}
              </Text>
              {renderFormField('price', t('cars.price'), t('cars.enterPrice'), 'numeric')}
              {renderFormField('purchase_price', t('cars.purchasePrice'), t('cars.enterPurchasePrice'), 'numeric')}
              {renderFormField('purchase_date', t('cars.purchaseDate'), t('cars.enterPurchaseDate'))}
            </View>

            {/* Сервісна інформація */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('cars.serviceInfo')}
              </Text>
              {renderFormField('last_service_date', t('cars.lastServiceDate'), t('cars.enterLastServiceDate'))}
              {renderFormField('next_service_date', t('cars.nextServiceDate'), t('cars.enterNextServiceDate'))}
            </View>

            {/* Додаткова інформація */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('cars.additionalInfo')}
              </Text>
              {renderFormField('description', t('cars.description'), t('cars.enterDescription'))}
            </View>

            {/* Зображення */}
            {renderImagePicker()}

            {/* Кнопка збереження */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {isEditMode ? t('common.update') : t('common.save')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
    marginBottom: SIZES.medium,
  },
  formGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: FONTS.sizes.medium,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  select: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  imagePickerContainer: {
    marginBottom: SIZES.medium,
  },
  imagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
  addImageButton: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 30,
  },
  submitButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: FONTS.sizes.small,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AddCarScreen;
