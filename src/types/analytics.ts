/**
 * Типи для модуля аналітики
 */

// Періоди для аналітики
export type AnalyticsPeriod = 'week' | 'month' | 'year' | 'all';

// Типи графіків
export type ChartType = 'expenses' | 'profits' | 'cars' | 'buyers';

// Дані для лінійного графіка
export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
  }[];
}

// Дані для кругової діаграми
export interface PieChartItem {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

// Категорії витрат
export interface ExpenseCategories {
  purchase: number;
  repair: number;
  parts: number;
  fuel: number;
  insurance: number;
  tax: number;
  other: number;
}

// Дані аналітики витрат
export interface ExpensesAnalytics {
  categories: ExpenseCategories;
  timeline: LineChartData;
}

// Дані аналітики прибутків
export interface ProfitsAnalytics {
  timeline: LineChartData;
  total: number;
}

// Дані аналітики автомобілів
export interface CarsAnalytics {
  active: number;
  sold: number;
  totalInvestment: number;
  potentialProfit: number;
}

// Дані аналітики покупців
export interface BuyersAnalytics {
  total: number;
  active: number;
  averagePurchases: number;
}

// Повні дані аналітики
export interface AnalyticsData {
  expenses: ExpensesAnalytics;
  profits: ProfitsAnalytics;
  cars: CarsAnalytics;
  buyers?: BuyersAnalytics;
}
