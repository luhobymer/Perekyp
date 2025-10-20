/**
 * Типи для екрану зображень автомобіля
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CarsStackParamList } from '../navigation/carsNavigator';

/**
 * Зображення автомобіля
 */
export interface CarImage {
  /**
   * Унікальний ідентифікатор зображення
   */
  id: string | number;
  
  /**
   * URL зображення
   */
  url: string;
  
  /**
   * Дата додавання зображення
   */
  date?: string;
  
  /**
   * Опис зображення
   */
  description?: string;
}

/**
 * Пропси для екрану зображень автомобіля
 */
export interface CarImagesScreenProps {
  route: RouteProp<CarsStackParamList, 'CarImages'>;
  navigation: NativeStackNavigationProp<CarsStackParamList>;
}
