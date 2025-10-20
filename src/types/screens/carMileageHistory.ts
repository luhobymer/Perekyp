/**
 * Типи для екрану історії пробігу автомобіля
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CarsStackParamList } from '../navigation/carsNavigator';

/**
 * Запис пробігу автомобіля
 */
export interface MileageRecord {
  /**
   * Унікальний ідентифікатор запису
   */
  id: string | number;
  
  /**
   * Дата запису у форматі ISO
   */
  date: string;
  
  /**
   * Значення пробігу в кілометрах
   */
  mileage: number;
  
  /**
   * Примітка до запису
   */
  note?: string;
}

/**
 * Пропси для екрану історії пробігу
 */
export interface CarMileageHistoryScreenProps {
  route: RouteProp<CarsStackParamList, 'CarMileageHistory'>;
  navigation: NativeStackNavigationProp<CarsStackParamList>;
}
