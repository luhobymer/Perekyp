import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  Expense, 
  ExpenseCategory, 
  ExpenseCategoriesDict, 
  ExpenseFilter,
  ExpenseScreenParams 
} from '../../types/expenses';

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
  CarExpenses: ExpenseScreenParams;
  AddExpense: { carId: string | number };
  ExpenseDetails: { expense: Expense };
};

type CarExpensesScreenRouteProp = RouteProp<RootStackParamList, 'CarExpenses'>;
type CarExpensesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CarExpensesScreenProps {
  route: CarExpensesScreenRouteProp;
  navigation: CarExpensesScreenNavigationProp;
}

const CarExpensesScreen: React.FC<CarExpensesScreenProps> = ({ route, navigation }) => {
  // Додаємо перевірку наявності route та navigation
  const { carId = null, newExpense = null } = route?.params || {};
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<ExpenseCategory | 'all'>('all');

  // Моковані дані для демонстрації
  useEffect(() => {
    // Тут буде запит до бази даних, зараз використовуємо моковані дані
    setTimeout(() => {
      const mockExpenses: Expense[] = [
        { id: 1, category: 'purchase', amount: 28000, date: '2023-05-10', description: 'Початкова купівля автомобіля' },
        { id: 2, category: 'repair', amount: 1200, date: '2023-05-15', description: 'Заміна масла та фільтрів' },
        { id: 3, category: 'parts', amount: 800, date: '2023-05-20', description: 'Нові гальмівні колодки' },
        { id: 4, category: 'fuel', amount: 250, date: '2023-05-25', description: 'Заправка дизелю' },
        { id: 5, category: 'insurance', amount: 1500, date: '2023-06-01', description: 'Страховка на рік' },
        { id: 6, category: 'tax', amount: 500, date: '2023-06-05', description: 'Податок за переоформлення' },
        { id: 7, category: 'repair', amount: 350, date: '2023-06-15', description: 'Розвал-сходження' },
        { id: 8, category: 'fuel', amount: 280, date: '2023-06-20', description: 'Заправка дизелю' },
      ];
      
      setExpenses(mockExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setTotalExpenses(mockExpenses.reduce((sum, expense) => sum + expense.amount, 0));
      setLoading(false);
    }, 800);
  }, [carId]);

  // Додавання нової витрати, якщо вона передана через параметри
  useEffect(() => {
    if (newExpense && navigation) {
      // В реальному додатку тут буде запит до API для збереження витрати
      setExpenses(prevExpenses => {
        const updatedExpenses = [newExpense, ...prevExpenses];
        // Оновлюємо також загальну суму витрат
        setTotalExpenses(updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0));
        return updatedExpenses;
      });
      
      // Очищаємо параметр, щоб уникнути повторного додавання
      navigation.setParams({ newExpense: null });
    }
  }, [newExpense, navigation]);

  // Фільтрувати витрати за категорією
  const filteredExpenses = selectedFilter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedFilter);

  // Форматування дати
  const formatDate = useCallback((dateString: string): string => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: uk });
  }, []);

  // Рендеринг елемента фільтра
  const renderFilterItem = useCallback(({ item }: { item: ExpenseFilter }) => {
    const isSelected = selectedFilter === item.value;
    const categoryInfo = item.value !== 'all' ? EXPENSE_CATEGORIES[item.value] : null;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          {
            backgroundColor: isSelected ? theme.colors.primary : 'transparent',
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          },
        ]}
        onPress={() => setSelectedFilter(item.value)}
      >
        {categoryInfo && (
          <Ionicons
            name={categoryInfo.icon as any}
            size={16}
            color={isSelected ? '#FFFFFF' : categoryInfo.color}
          />
        )}
        <Text
          style={[
            styles.filterText,
            {
              color: isSelected ? '#FFFFFF' : theme.colors.text,
              fontWeight: isSelected ? 'bold' : 'normal',
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedFilter, theme]);

  // Рендеринг елемента витрати
  const renderExpenseItem = useCallback(({ item }: { item: Expense }) => {
    const categoryInfo = EXPENSE_CATEGORIES[item.category];
    
    return (
      <TouchableOpacity
        style={[
          styles.expenseItem,
          { backgroundColor: theme.colors.card, shadowColor: 'rgba(0, 0, 0, 0.1)' }
        ]}
        onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
      >
        <View style={[styles.categoryIcon, { backgroundColor: categoryInfo.color }]}>
          <Ionicons name={categoryInfo.icon as any} size={24} color="#FFFFFF" />
        </View>
        
        <View style={styles.expenseContent}>
          <View style={styles.expenseHeader}>
            <Text 
              style={[styles.expenseDescription, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {item.description}
            </Text>
            <Text style={[styles.expenseAmount, { color: theme.colors.text }]}>
              {item.amount} ₴
            </Text>
          </View>
          
          <View style={styles.expenseFooter}>
            <Text style={[styles.expenseDate, { color: theme.colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
            <Text style={[styles.expenseCategory, { color: categoryInfo.color }]}>
              {t(`expense_category_${item.category}`)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [formatDate, navigation, t, theme]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Заголовок з загальною сумою витрат */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textSecondary }]}>
          {t('total_expenses')}
        </Text>
        <Text style={[styles.headerAmount, { color: theme.colors.text }]}>
          {totalExpenses} ₴
        </Text>
      </View>
      
      {/* Фільтри категорій */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={[
            { label: t('all'), value: 'all' },
            { label: t('expense_category_purchase'), value: 'purchase' },
            { label: t('expense_category_repair'), value: 'repair' },
            { label: t('expense_category_parts'), value: 'parts' },
            { label: t('expense_category_fuel'), value: 'fuel' },
            { label: t('expense_category_insurance'), value: 'insurance' },
            { label: t('expense_category_tax'), value: 'tax' },
            { label: t('expense_category_other'), value: 'other' },
          ] as ExpenseFilter[]}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {/* Список витрат */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.expensesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="cash-remove" 
              size={64} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {selectedFilter === 'all' 
                ? t('no_expenses_yet') 
                : t('no_expenses_in_category')}
            </Text>
          </View>
        }
      />
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
  header: {
    padding: SIZES.medium,
    marginBottom: SIZES.small,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.medium,
    marginBottom: SIZES.xsmall,
  },
  headerAmount: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  filtersContainer: {
    marginBottom: SIZES.small,
  },
  filtersList: {
    paddingHorizontal: SIZES.medium,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.xsmall,
    paddingHorizontal: SIZES.small,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
    borderWidth: 1,
  },
  filterText: {
    fontSize: FONTS.sizes.small,
    marginLeft: SIZES.xsmall,
  },
  expensesList: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.xxl,
  },
  expenseItem: {
    flexDirection: 'row',
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    padding: SIZES.medium,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  expenseContent: {
    flex: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xsmall,
  },
  expenseDescription: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.semiBold as any,
    flex: 1,
    marginRight: SIZES.small,
  },
  expenseAmount: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold as any,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseDate: {
    fontSize: FONTS.sizes.small,
  },
  expenseCategory: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium as any,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyText: {
    fontSize: FONTS.sizes.medium,
    marginTop: SIZES.medium,
    textAlign: 'center',
  },
});

export default CarExpensesScreen;
