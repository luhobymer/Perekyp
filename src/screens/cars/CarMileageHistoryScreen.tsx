import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
// @ts-ignore - Ігноруємо помилку відсутності типів
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { MileageRecord, CarMileageHistoryScreenProps } from '../../types/screens/carMileageHistory';

/**
 * Екран історії пробігу автомобіля
 */
const CarMileageHistoryScreen: React.FC<CarMileageHistoryScreenProps> = ({ route }) => {
  const { carId } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [mileageHistory, setMileageHistory] = useState<MileageRecord[]>([]);
  const [car, setCar] = useState<{ brand: string; model: string; year: string } | null>(null);

  // Отримання даних про пробіг
  useEffect(() => {
    const fetchMileageHistory = async () => {
      try {
        // Тут буде запит до API або бази даних
        // Наразі використовуємо тестові дані
        setTimeout(() => {
          const testData: MileageRecord[] = [
            { id: 1, mileage: 125000, date: '2023-05-10', note: 'Регулярна перевірка' },
            { id: 2, mileage: 124000, date: '2023-04-15', note: 'Після сервісу' },
            { id: 3, mileage: 122500, date: '2023-03-20', note: '' },
            { id: 4, mileage: 120000, date: '2023-02-05', note: 'Перед ТО' },
          ];
          setMileageHistory(testData);
          setCar({ brand: 'Toyota', model: 'Camry', year: '2018' });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching mileage history:', error);
        setLoading(false);
      }
    };

    fetchMileageHistory();
  }, [carId]);

  /**
   * Форматування дати
   */
  const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: uk });
  };

  /**
   * Отримання різниці пробігу між поточним та попереднім записом
   */
  const getMileageDifference = (index: number): number | null => {
    if (index === mileageHistory.length - 1) {
      return null; // Перший запис, немає попереднього для порівняння
    }

    const currentMileage = mileageHistory[index].mileage;
    const prevMileage = mileageHistory[index + 1].mileage;
    return currentMileage - prevMileage;
  };

  /**
   * Рендер елемента списку пробігу
   */
  const renderMileageItem = ({ item, index }: { item: MileageRecord; index: number }) => {
    const difference = getMileageDifference(index);

    return (
      <View style={[styles.mileageItem, { backgroundColor: theme.colors.card }]}>
        <View style={styles.mileageHeader}>
          <Text style={[styles.mileageDate, { color: theme.colors.text }]}>
            {formatDateString(item.date)}
          </Text>
          <Text style={[styles.mileageValue, { color: theme.colors.text }]}>
            {item.mileage.toLocaleString()} {t('km')}
          </Text>
        </View>

        {difference !== null && (
          <Text style={[styles.mileageDifference, { color: theme.colors.textSecondary }]}>
            +{difference.toLocaleString()} {t('km_since_last')}
          </Text>
        )}

        {item.note && (
          <Text style={[styles.mileageNotes, { color: theme.colors.textSecondary }]}>
            {item.note}
          </Text>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContent}>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t('no_mileage_records')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            {t('add_mileage_record_prompt')}
          </Text>
        </View>
      </View>
    );
  };

  const handleAddMileage = () => {
    Alert.alert('Додавання пробігу буде реалізовано в наступних версіях');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('mileage_history')}
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          {car?.brand} {car?.model} ({car?.year})
        </Text>
      </View>

      {mileageHistory.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={mileageHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMileageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddMileage}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
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
  listContent: {
    padding: SIZES.medium,
  },
  headerContainer: {
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
  },
  headerTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: 'bold',
    marginBottom: SIZES.xsmall,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.medium,
    opacity: 0.8,
  },
  totalMileage: {
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  totalMileageLabel: {
    fontSize: FONTS.sizes.small,
    marginBottom: SIZES.xsmall,
  },
  totalMileageValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
  },
  mileageItem: {
    marginBottom: SIZES.small,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
  },
  mileageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xsmall,
  },
  mileageDate: {
    fontSize: FONTS.sizes.medium,
    fontWeight: '600',
  },
  mileageValue: {
    fontSize: FONTS.sizes.large,
    fontWeight: 'bold',
  },
  mileageDifference: {
    fontSize: FONTS.sizes.small,
    marginBottom: SIZES.xsmall,
  },
  mileageNotes: {
    fontSize: FONTS.sizes.small,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.medium,
    textAlign: 'center',
    opacity: 0.7,
  },
  addButton: {
    position: 'absolute',
    bottom: SIZES.large,
    right: SIZES.large,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CarMileageHistoryScreen;
