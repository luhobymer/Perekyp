import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ImageStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
// @ts-ignore - Ігноруємо помилку відсутності типів
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  Car, 
  Expense, 
  SellCarScreenProps, 
  SellData 
} from '../../types/screens/sellCar';

/**
 * Екран для продажу автомобіля
 */
const SellCarScreen: React.FC<SellCarScreenProps> = ({ route, navigation }) => {
  const { carId } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Завантаження даних про автомобіль
  const [loading, setLoading] = useState<boolean>(true);
  const [car, setCar] = useState<Car | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  
  // Стан для полів форми
  const [sellPrice, setSellPrice] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [sellDate, setSellDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  
  // Розрахункові значення
  const [profit, setProfit] = useState<number>(0);
  const [profitPercentage, setProfitPercentage] = useState<number>(0);
  
  // Завантаження даних про автомобіль
  useEffect(() => {
    // Моковані дані для демонстрації, в реальному додатку тут буде запит до БД
    setTimeout(() => {
      const mockCar: Car = {
        id: carId,
        brand: 'BMW',
        model: 'X5',
        year: 2019,
        color: 'Чорний',
        vin: 'WBAFG810X0Lxxxxxx',
        plate: 'AA1234BB',
        engine: 'Дизель, 3.0',
        mileage: 75000,
        status: 'active',
        purchaseDate: '2023-05-10',
        purchasePrice: 28000,
        images: [
          'https://cdn.pixabay.com/photo/2016/04/17/22/10/bmw-1335674_1280.png',
        ]
      };
      
      const mockExpenses: Expense[] = [
        { id: 1, category: 'purchase', amount: 28000, date: '2023-05-10', description: 'Початкова купівля' },
        { id: 2, category: 'repair', amount: 1200, date: '2023-05-15', description: 'Заміна масла та фільтрів' },
        { id: 3, category: 'parts', amount: 800, date: '2023-05-20', description: 'Нові гальмівні колодки' },
        { id: 4, category: 'fuel', amount: 500, date: '2023-06-01', description: 'Заправка' },
      ];
      
      setCar(mockCar);
      const totalExp = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(totalExp);
      setLoading(false);
    }, 1000);
  }, [carId]);
  
  // Оновлення розрахунків при зміні ціни продажу
  useEffect(() => {
    if (car && sellPrice) {
      const sellPriceNum = parseFloat(sellPrice);
      if (!isNaN(sellPriceNum)) {
        const totalInvestment = totalExpenses;
        const profitValue = sellPriceNum - totalInvestment;
        setProfit(profitValue);
        setProfitPercentage((profitValue / totalInvestment) * 100);
      }
    }
  }, [car, sellPrice, totalExpenses]);
  
  /**
   * Форматування дати
   */
  const formatDate = (date: Date): string => {
    return format(date, 'd MMMM yyyy', { locale: uk });
  };
  
  /**
   * Обробка зміни дати
   */
  const handleDateChange = (_event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || sellDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSellDate(currentDate);
  };
  
  /**
   * Валідація форми
   */
  const validateForm = (): boolean => {
    if (!sellPrice.trim() || isNaN(parseFloat(sellPrice))) {
      Alert.alert(t('error'), t('please_enter_valid_sell_price'));
      return false;
    }
    
    if (!buyerName.trim()) {
      Alert.alert(t('error'), t('please_enter_buyer_name'));
      return false;
    }
    
    return true;
  };
  
  /**
   * Продаж автомобіля
   */
  const handleSellCar = (): void => {
    if (!validateForm()) return;
    
    const sellData: SellData = {
      sellPrice,
      buyerName,
      buyerPhone,
      sellDate,
      notes
    };
    
    Alert.alert(
      t('confirm_sale'),
      t('confirm_sale_message', { car: `${car?.brand} ${car?.model}`, price: sellPrice }),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('confirm'),
          onPress: async () => {
            // В реальному додатку тут буде запит до API для збереження даних
            console.log('Продаж автомобіля:', sellData);
            
            // Показуємо повідомлення про успішний продаж
            Alert.alert(
              t('success'),
              t('car_sold_successfully'),
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{t('loading')}</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Інформація про автомобіль */}
        <View style={[styles.carInfo, { backgroundColor: theme.colors.card }]}>
          <View style={styles.carImageContainer}>
            {car?.images && car.images.length > 0 ? (
              <Image source={{ uri: car.images[0] }} style={styles.carImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="car-outline" size={30} color={theme.colors.text} />
              </View>
            )}
          </View>
          <View style={styles.carDetails}>
            <Text style={[styles.carTitle, { color: theme.colors.text }]}>
              {car?.brand} {car?.model}
            </Text>
            <Text style={[styles.carSubtitle, { color: theme.colors.textSecondary }]}>
              {car?.year}, {car?.engine}
            </Text>
            <Text style={[styles.carPrice, { color: theme.colors.primary }]}>
              {t('purchase_price')}: €{car?.purchasePrice}
            </Text>
          </View>
        </View>
        
        {/* Сумарні витрати */}
        <View style={[styles.summaryContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
              {t('total_expenses')}:
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              €{totalExpenses}
            </Text>
          </View>
        </View>
        
        {/* Форма продажу */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('sell_details')}
          </Text>
          
          {/* Ціна продажу */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('sell_price')} *
            </Text>
            <View style={styles.priceInputContainer}>
              <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>€</Text>
              <TextInput
                style={[
                  styles.priceInput, 
                  { 
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.card
                  }
                ]}
                keyboardType="numeric"
                value={sellPrice}
                onChangeText={setSellPrice}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>
          
          {/* Ім'я покупця */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('buyer_name')} *
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card
                }
              ]}
              value={buyerName}
              onChangeText={setBuyerName}
              placeholder={t('enter_buyer_name')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
          
          {/* Телефон покупця */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('buyer_phone')}
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card
                }
              ]}
              value={buyerPhone}
              onChangeText={setBuyerPhone}
              placeholder={t('enter_buyer_phone')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
          
          {/* Дата продажу */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('sell_date')}
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
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formatDate(sellDate)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={sellDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </View>
          
          {/* Примітки */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('notes')}
            </Text>
            <TextInput
              style={[
                styles.noteInput, 
                { 
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card
                }
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder={t('enter_notes')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </View>
        </View>
        
        {/* Розрахунок прибутку */}
        {sellPrice && !isNaN(parseFloat(sellPrice)) && (
          <View 
            style={[
              styles.profitContainer, 
              { 
                backgroundColor: theme.colors.card,
                borderColor: profit >= 0 ? theme.colors.success : theme.colors.error
              }
            ]}
          >
            <View style={styles.profitRow}>
              <Text style={[styles.profitLabel, { color: theme.colors.text }]}>
                {t('profit')}:
              </Text>
              <Text 
                style={[
                  styles.profitValue, 
                  { color: profit >= 0 ? theme.colors.success : theme.colors.error }
                ]}
              >
                €{profit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.profitRow}>
              <Text style={[styles.profitPercentLabel, { color: theme.colors.textSecondary }]}>
                {t('profit_percentage')}:
              </Text>
              <Text 
                style={[
                  styles.profitPercentValue, 
                  { color: profit >= 0 ? theme.colors.success : theme.colors.error }
                ]}
              >
                {profitPercentage.toFixed(2)}%
              </Text>
            </View>
          </View>
        )}
        
        {/* Кнопки дій */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.cancelButton, 
              { borderColor: theme.colors.border }
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.sellButton, 
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleSellCar}
          >
            <Text style={[styles.buttonText, styles.sellButtonText]}>
              {t('sell_car')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  carInfo: {
    flexDirection: 'row',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  carImageContainer: {
    width: 80,
    height: 80,
    borderRadius: SIZES.small,
    overflow: 'hidden',
    marginRight: SIZES.medium,
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  } as ImageStyle,
  noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  carTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.xxs,
  },
  carSubtitle: {
    fontSize: FONTS.sizes.small,
    marginBottom: SIZES.xsmall,
  },
  carPrice: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.semiBold as any,
  },
  summaryContainer: {
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONTS.sizes.medium,
  },
  summaryValue: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
  },
  formSection: {
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.medium,
  },
  formGroup: {
    marginBottom: SIZES.medium,
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
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold as any,
    marginRight: SIZES.xsmall,
  },
  priceInput: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold as any,
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
  profitContainer: {
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xsmall,
  },
  profitLabel: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  profitValue: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
  },
  profitPercentLabel: {
    fontSize: FONTS.sizes.small,
  },
  profitPercentValue: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.semiBold as any,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
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
  sellButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  sellButtonText: {
    color: '#FFFFFF',
  },
});

export default SellCarScreen;
