/**
 * Типи для екрану продажу автомобіля
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CarsStackParamList } from '../navigation/carsNavigator';

/**
 * Інтерфейс для автомобіля
 */
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  plate: string;
  engine: string;
  mileage: number;
  status: 'active' | 'sold' | 'archived';
  purchaseDate: string;
  purchasePrice: number;
  images: string[];
}

/**
 * Інтерфейс для витрати
 */
export interface Expense {
  id: string | number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

/**
 * Інтерфейс для даних продажу
 */
export interface SellData {
  sellPrice: string;
  buyerName: string;
  buyerPhone: string;
  sellDate: Date;
  notes: string;
}

/**
 * Пропси для екрану продажу автомобіля
 */
export interface SellCarScreenProps {
  route: RouteProp<CarsStackParamList, 'SellCar'>;
  navigation: NativeStackNavigationProp<CarsStackParamList>;
}
