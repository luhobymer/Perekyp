import { StyleProp, ViewStyle } from 'react-native';

/**
 * Типи періодів для аналітики
 */
export type AnalyticsPeriod = 'week' | 'month' | 'year' | 'all';

/**
 * Типи графіків для аналітики
 */
export type AnalyticsChartType = 'expenses' | 'profits' | 'cars' | 'buyers';

/**
 * Дані для графіка витрат за категоріями
 */
export interface ExpensesCategoriesData {
  purchase: number;
  repair: number;
  parts: number;
  fuel: number;
  insurance: number;
  tax: number;
  other: number;
  [key: string]: number;
}

/**
 * Дані для часової лінії (графік)
 */
export interface TimelineData {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
  }[];
}

/**
 * Дані для аналітики витрат
 */
export interface ExpensesAnalyticsData {
  categories: ExpensesCategoriesData;
  timeline: TimelineData;
}

/**
 * Дані для аналітики прибутків
 */
export interface ProfitsAnalyticsData {
  timeline: TimelineData;
  total: number;
}

/**
 * Дані для аналітики автомобілів
 */
export interface CarsAnalyticsData {
  active: number;
  sold: number;
  totalInvestment: number;
  potentialProfit: number;
}

/**
 * Дані для аналітики покупців
 */
export interface BuyersAnalyticsData {
  total: number;
  active: number;
  completed: number;
  averageDealTime: number;
}

/**
 * Повні дані аналітики
 */
export interface AnalyticsData {
  expenses: ExpensesAnalyticsData;
  profits: ProfitsAnalyticsData;
  cars: CarsAnalyticsData;
  buyers?: BuyersAnalyticsData;
}

/**
 * Дані для кругової діаграми
 */
export interface PieChartData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

/**
 * Конфігурація для графіків
 */
export interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
  style: {
    borderRadius: number;
  };
  propsForDots: {
    r: string;
    strokeWidth: string;
    stroke: string;
  };
}

/**
 * Пропси для компонента AnalyticsScreen
 */
export interface AnalyticsScreenProps {
  /**
   * Початкова вкладка для відображення
   * @default 'expenses'
   */
  initialTab?: AnalyticsChartType;
  
  /**
   * Стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
}
