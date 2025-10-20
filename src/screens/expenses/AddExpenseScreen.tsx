import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useCars } from '../../hooks/useCars';
import Picker from 'react-native-picker-select';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  ExpenseCategory, 
  ExpenseCategoriesDict, 
  ExpenseFormData,
  ExpenseFormValidation,
  Expense
} from '../../types/expenses';
import { Car } from '../../types/cars';

// Категорії витрат з відповідними іконками та кольорами
const EXPENSE_CATEGORIES: ExpenseCategoriesDict = {
  purchase: { icon: 'car-outline', color: '#4A90E2' },
  repair: { icon: 'construct-outline', color: '#F5A623' },
  parts: { icon: 'cog-outline', color: '#50E3C2' },
  fuel: { icon: 'flame-outline', color: '#E84855' },
  insurance: { icon: 'shield-outline', color: '#9013FE' },
  tax: { icon: 'receipt-outline', color: '#B8E986' },
  other: { icon: 'ellipsis-horizontal-circle-outline', color: '#AAAAAA' },
};

// Типи для навігації
type RootStackParamList = {
  CarExpenses: { carId: string | number; newExpense?: Expense };
  AddExpense: { carId?: string | number };
};

type AddExpenseScreenRouteProp = RouteProp<RootStackParamList, 'AddExpense'>;
type AddExpenseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AddExpenseScreenProps {
  route: AddExpenseScreenRouteProp;
  navigation: AddExpenseScreenNavigationProp;
}

interface CarOption {
  label: string;
  value: string | number;
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ route, navigation }) => {
  // Безпечне отримання carId з параметрів або значення за замовчуванням, якщо параметри відсутні
  const carId = route?.params?.carId || null;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { getCars } = useCars();
  
  // Стан для полів форми
  const [cars, setCars] = useState<CarOption[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | number | null>(carId);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  
  // Завантаження автомобілів для вибору, якщо carId не передано
  useEffect(() => {
    const loadCars = async () => {
      try {
        const carsData = await getCars();
        if (carsData && carsData.length > 0) {
          const formattedCars = carsData.map((car: Car) => ({
            label: `${car.brand} ${car.model} (${car.year})`,
            value: car.id
          }));
          setCars(formattedCars);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
        Alert.alert(t('error'), t('failed_to_load_cars'));
      }
    };
    
    loadCars();
  }, [getCars, t]);
  
  // Обробник вибору автомобіля
  const handleCarSelection = useCallback((value: string | number | null) => {
    setSelectedCarId(value);
    console.log('Вибраний автомобіль:', value);
  }, []);
  
  // Обробка зміни дати
  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  }, [date]);
  
  // Форматування дати для відображення
  const formatDate = useCallback((date: Date): string => {
    return format(date, 'd MMMM yyyy', { locale: uk });
  }, []);
  
  // Валідація форми
  const validateForm = useCallback((): ExpenseFormValidation => {
    const errors: ExpenseFormValidation['errors'] = {};
    
    if (!description.trim()) {
      errors.description = t('please_enter_description');
    }
    
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      errors.amount = t('please_enter_valid_amount');
    }
    
    if (!category) {
      errors.category = t('please_select_category');
    }
    
    if (!carId && !selectedCarId) {
      errors.carId = t('please_select_car');
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [description, amount, category, carId, selectedCarId, t]);
  
  // Збереження витрати
  const handleSave = useCallback(() => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0];
      Alert.alert(t('error'), errorMessage);
      return;
    }
    
    // Створення об'єкту витрати
    const expenseData: Expense = {
      id: Date.now(), // Тимчасовий ID, в реальному додатку буде генеруватися на сервері
      description: description.trim(),
      amount: parseFloat(amount),
      category: category as ExpenseCategory,
      date: format(date, 'yyyy-MM-dd'),
      note: note.trim(),
      carId: selectedCarId || carId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // В реальному додатку тут буде запит до API для збереження витрати
    console.log('Збереження витрати:', expenseData);
    
    // Перехід на екран витрат з передачею нової витрати
    navigation.navigate('CarExpenses', {
      carId: selectedCarId || carId,
      newExpense: expenseData
    });
  }, [validateForm, description, amount, category, date, note, selectedCarId, carId, navigation, t]);
  
  // Рендер списку категорій
  const renderCategories = useCallback(() => {
    return Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => {
      const isSelected = category === key;
      
      return (
        <TouchableOpacity
          key={key}
          style={[
            styles.categoryItem,
            {
              backgroundColor: isSelected ? value.color : 'transparent',
              borderColor: isSelected ? value.color : theme.colors.border,
            },
          ]}
          onPress={() => setCategory(key as ExpenseCategory)}
        >
          <View
            style={[
              styles.categoryIcon,
              {
                backgroundColor: isSelected ? '#FFFFFF' : value.color,
              },
            ]}
          >
            <Ionicons
              name={value.icon as any}
              size={18}
              color={isSelected ? value.color : '#FFFFFF'}
            />
          </View>
          <Text
            style={[
              styles.categoryText,
              {
                color: isSelected ? '#FFFFFF' : theme.colors.text,
                fontWeight: isSelected ? 'bold' : 'normal',
              },
            ]}
          >
            {t(`expense_category_${key}`)}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [category, theme, t]);
  
  // Кнопка назад
  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Вибір автомобіля, якщо carId не передано */}
        {!carId && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('select_car')}
            </Text>
            <View style={[
              styles.pickerContainer, 
              { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card 
              }
            ]}>
              <Picker
                items={cars}
                value={selectedCarId}
                onValueChange={handleCarSelection}
                placeholder={{ label: t('select_car_placeholder'), value: null }}
                style={{
                  inputIOS: { 
                    color: theme.colors.text,
                    paddingHorizontal: SIZES.medium,
                    fontSize: FONTS.sizes.medium,
                  },
                  inputAndroid: { 
                    color: theme.colors.text,
                    paddingHorizontal: SIZES.medium,
                    fontSize: FONTS.sizes.medium,
                  },
                  placeholder: { 
                    color: theme.colors.textSecondary,
                  }
                }}
              />
            </View>
          </View>
        )}
        
        {/* Опис витрати */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('expense_description')}
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text 
              }
            ]}
            placeholder={t('expense_description_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
          />
        </View>
        
        {/* Сума витрати */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('expense_amount')}
          </Text>
          <View style={styles.amountInputContainer}>
            <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>₴</Text>
            <TextInput
              style={[
                styles.amountInput, 
                { 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text 
                }
              ]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>
        
        {/* Категорія витрати */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('expense_category')}
          </Text>
          <View style={styles.categoriesContainer}>
            {renderCategories()}
          </View>
        </View>
        
        {/* Дата витрати */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('expense_date')}
          </Text>
          <TouchableOpacity
            style={[
              styles.datePickerButton, 
              { 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card 
              }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
        
        {/* Примітка */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('expense_note')} ({t('optional')})
          </Text>
          <TextInput
            style={[
              styles.noteInput, 
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                textAlignVertical: 'top'
              }
            ]}
            placeholder={t('expense_note_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
        </View>
        
        {/* Кнопки дій */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.cancelButton, 
              { borderColor: theme.colors.border }
            ]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.saveButton, 
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>
              {t('save')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  formGroup: {
    marginBottom: SIZES.large,
  },
  label: {
    fontSize: FONTS.sizes.small,
    marginBottom: SIZES.xsmall,
  },
  input: {
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    fontSize: FONTS.sizes.medium,
  },
  pickerContainer: {
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 5,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold as any,
    marginRight: SIZES.xsmall,
  },
  amountInput: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold as any,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: SIZES.small,
    paddingVertical: SIZES.xsmall,
    paddingHorizontal: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xsmall,
  },
  categoryText: {
    fontSize: FONTS.sizes.small,
  },
  datePickerButton: {
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FONTS.sizes.medium,
    marginLeft: SIZES.small,
  },
  noteInput: {
    height: 100,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontSize: FONTS.sizes.medium,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.large,
  },
  button: {
    width: '48%',
    height: 48,
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  selectedCarInfo: {
    marginTop: SIZES.small,
    fontSize: FONTS.sizes.small,
  },
});

export default AddExpenseScreen;
