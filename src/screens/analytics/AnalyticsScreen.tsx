import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import {
  AnalyticsPeriod,
  ChartType,
  AnalyticsData,
  PieChartItem,
  ExpenseCategories
} from '../../types/analytics';

const { width } = Dimensions.get('window');
const chartWidth = width - SIZES.medium * 2;

interface AnalyticsScreenProps {
  initialTab?: ChartType;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ initialTab = 'expenses' }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('month');
  const [selectedChart, setSelectedChart] = useState<ChartType>(initialTab);
  
  // Моковані дані
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  
  // Завантаження даних
  useEffect(() => {
    // В реальному додатку тут буде запит API
    setTimeout(() => {
      const mockData: AnalyticsData = {
        expenses: {
          categories: {
            purchase: 45000,
            repair: 3600,
            parts: 2200,
            fuel: 1800,
            insurance: 1500,
            tax: 900,
            other: 500,
          },
          timeline: {
            labels: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'],
            datasets: [
              {
                data: [3000, 5500, 8000, 12000, 16000, 10000],
                color: (opacity = 1) => `rgba(139, 0, 0, ${opacity})`, // тематичний колір
              }
            ]
          }
        },
        profits: {
          timeline: {
            labels: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'],
            datasets: [
              {
                data: [1200, 1800, 2500, 3200, 3800, 2000],
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // зелений
              }
            ]
          },
          total: 14500
        },
        cars: {
          active: 4,
          sold: 3,
          totalInvestment: 55500,
          potentialProfit: 8000
        },
        buyers: {
          total: 8,
          active: 5,
          averagePurchases: 1.5
        }
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Додаємо useEffect для оновлення обраної вкладки при зміні параметра
  useEffect(() => {
    if (initialTab && ['expenses', 'profits', 'cars', 'buyers'].includes(initialTab)) {
      setSelectedChart(initialTab);
    }
  }, [initialTab]);
  
  // Зміна періоду
  const handlePeriodChange = useCallback((period: AnalyticsPeriod) => {
    setSelectedPeriod(period);
    // В реальному додатку тут буде оновлення даних для вибраного періоду
  }, []);
  
  // Конфігурація для графіків
  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };
  
  // Підготовка даних для діаграми категорій витрат
  const getPieChartData = useCallback((): PieChartItem[] => {
    if (!analyticsData) return [];
    
    const colors = [
      '#4A90E2', // синій
      '#F5A623', // оранжевий
      '#50E3C2', // бірюзовий
      '#E84855', // червоний
      '#9013FE', // фіолетовий
      '#B8E986', // зелений
      '#AAAAAA', // сірий
    ];
    
    return Object.entries(analyticsData.expenses.categories).map(([key, value], index) => ({
      name: t(`expense_category_${key}`),
      value,
      color: colors[index % colors.length],
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    }));
  }, [analyticsData, t, theme]);
  
  // Рендеринг графіка витрат
  const renderExpensesChart = useCallback(() => {
    if (!analyticsData) return null;
    
    const pieChartData = getPieChartData();
    const totalExpenses = Object.values(analyticsData.expenses.categories).reduce((sum, value) => sum + value, 0);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          {t('expenses_by_category')}
        </Text>
        
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieChartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        
        <Text style={[styles.chartTitle, { color: theme.colors.text, marginTop: SIZES.large }]}>
          {t('expenses_timeline')}
        </Text>
        
        <View style={styles.lineChartContainer}>
          <LineChart
            data={analyticsData.expenses.timeline}
            width={chartWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(139, 0, 0, ${opacity})`,
            }}
            bezier
            style={styles.lineChart}
          />
        </View>
        
        <View style={[styles.totalContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {t('total_expenses')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            {totalExpenses.toLocaleString()} ₴
          </Text>
        </View>
      </View>
    );
  }, [analyticsData, chartConfig, getPieChartData, t, theme]);
  
  // Рендеринг графіка прибутків
  const renderProfitsChart = useCallback(() => {
    if (!analyticsData) return null;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          {t('profits_timeline')}
        </Text>
        
        <View style={styles.lineChartContainer}>
          <LineChart
            data={analyticsData.profits.timeline}
            width={chartWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            bezier
            style={styles.lineChart}
          />
        </View>
        
        <View style={[styles.totalContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {t('total_profits')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            {analyticsData.profits.total.toLocaleString()} ₴
          </Text>
        </View>
      </View>
    );
  }, [analyticsData, chartConfig, t, theme]);
  
  // Рендеринг статистики автомобілів
  const renderCarsStats = useCallback(() => {
    if (!analyticsData) return null;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          {t('cars_statistics')}
        </Text>
        
        <View style={styles.carsStats}>
          <View style={[styles.carsStat, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.carsStatValue, { color: theme.colors.primary }]}>
              {analyticsData.cars.active}
            </Text>
            <Text style={[styles.carsStatLabel, { color: theme.colors.text }]}>
              {t('active_cars')}
            </Text>
          </View>
          
          <View style={[styles.carsStat, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.carsStatValue, { color: theme.colors.success }]}>
              {analyticsData.cars.sold}
            </Text>
            <Text style={[styles.carsStatLabel, { color: theme.colors.text }]}>
              {t('sold_cars')}
            </Text>
          </View>
        </View>
        
        <View style={[styles.totalContainer, { backgroundColor: theme.colors.card, marginTop: SIZES.medium }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {t('total_investment')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            {analyticsData.cars.totalInvestment.toLocaleString()} ₴
          </Text>
        </View>
        
        <View style={[styles.totalContainer, { backgroundColor: theme.colors.card, marginTop: SIZES.small }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {t('potential_profit')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.success }]}>
            {analyticsData.cars.potentialProfit.toLocaleString()} ₴
          </Text>
        </View>
      </View>
    );
  }, [analyticsData, t, theme]);
  
  // Рендеринг статистики покупців
  const renderBuyersStats = useCallback(() => {
    if (!analyticsData || !analyticsData.buyers) return null;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          {t('buyers_statistics')}
        </Text>
        
        <View style={styles.buyersStats}>
          <View style={[styles.buyersStat, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.buyersStatValue, { color: theme.colors.primary }]}>
              {analyticsData.buyers.total}
            </Text>
            <Text style={[styles.buyersStatLabel, { color: theme.colors.text }]}>
              {t('total_buyers')}
            </Text>
          </View>
          
          <View style={[styles.buyersStat, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.buyersStatValue, { color: theme.colors.success }]}>
              {analyticsData.buyers.active}
            </Text>
            <Text style={[styles.buyersStatLabel, { color: theme.colors.text }]}>
              {t('active_buyers')}
            </Text>
          </View>
        </View>
        
        <View style={[styles.totalContainer, { backgroundColor: theme.colors.card, marginTop: SIZES.medium }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {t('average_purchases')}
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            {analyticsData.buyers.averagePurchases.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  }, [analyticsData, t, theme]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} style={{ marginRight: SIZES.small }} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('analytics.title')}
          </Text>
        </View>
      </View>
      
      <View style={[styles.tabs, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedChart === 'expenses' && [
              styles.selectedTab, 
              { borderBottomColor: theme.colors.primary }
            ]
          ]}
          onPress={() => setSelectedChart('expenses')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: selectedChart === 'expenses' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            {t('expenses')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedChart === 'profits' && [
              styles.selectedTab, 
              { borderBottomColor: theme.colors.primary }
            ]
          ]}
          onPress={() => setSelectedChart('profits')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: selectedChart === 'profits' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            {t('profits')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedChart === 'cars' && [
              styles.selectedTab, 
              { borderBottomColor: theme.colors.primary }
            ]
          ]}
          onPress={() => setSelectedChart('cars')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: selectedChart === 'cars' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            {t('cars')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            selectedChart === 'buyers' && [
              styles.selectedTab, 
              { borderBottomColor: theme.colors.primary }
            ]
          ]}
          onPress={() => setSelectedChart('buyers')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: selectedChart === 'buyers' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            {t('buyers')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.periodSelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodsList}
        >
          <TouchableOpacity 
            style={[
              styles.periodItem, 
              selectedPeriod === 'week' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => handlePeriodChange('week')}
          >
            <Text style={[
              styles.periodText, 
              { color: selectedPeriod === 'week' ? '#FFFFFF' : theme.colors.text }
            ]}>
              {t('week')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.periodItem, 
              selectedPeriod === 'month' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => handlePeriodChange('month')}
          >
            <Text style={[
              styles.periodText, 
              { color: selectedPeriod === 'month' ? '#FFFFFF' : theme.colors.text }
            ]}>
              {t('month')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.periodItem, 
              selectedPeriod === 'year' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => handlePeriodChange('year')}
          >
            <Text style={[
              styles.periodText, 
              { color: selectedPeriod === 'year' ? '#FFFFFF' : theme.colors.text }
            ]}>
              {t('year')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.periodItem, 
              selectedPeriod === 'all' && { 
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={() => handlePeriodChange('all')}
          >
            <Text style={[
              styles.periodText, 
              { color: selectedPeriod === 'all' ? '#FFFFFF' : theme.colors.text }
            ]}>
              {t('all_time')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedChart === 'expenses' && renderExpensesChart()}
        {selectedChart === 'profits' && renderProfitsChart()}
        {selectedChart === 'cars' && renderCarsStats()}
        {selectedChart === 'buyers' && renderBuyersStats()}
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold as any,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.medium,
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  periodSelector: {
    paddingVertical: SIZES.small,
  },
  periodsList: {
    paddingHorizontal: SIZES.medium,
  },
  periodItem: {
    paddingVertical: SIZES.xsmall,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
  },
  periodText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  chartContainer: {
    marginBottom: SIZES.large,
  },
  chartTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.medium,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  lineChartContainer: {
    alignItems: 'center',
  },
  lineChart: {
    borderRadius: SIZES.small,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginTop: SIZES.medium,
  },
  totalLabel: {
    fontSize: FONTS.sizes.medium,
  },
  totalValue: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
  },
  carsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carsStat: {
    width: '48%',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    alignItems: 'center',
  },
  carsStatValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.small,
  },
  carsStatLabel: {
    fontSize: FONTS.sizes.medium,
  },
  buyersStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyersStat: {
    width: '48%',
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    alignItems: 'center',
  },
  buyersStatValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.small,
  },
  buyersStatLabel: {
    fontSize: FONTS.sizes.medium,
  },
});

export default AnalyticsScreen;
