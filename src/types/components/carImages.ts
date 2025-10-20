/**
 * Типи для компонента зображень автомобіля
 */

import { CarImage } from '../screens/carImages';

/**
 * Пропси для компонента зображень автомобіля
 */
export interface CarImagesProps {
  /**
   * Ідентифікатор автомобіля
   */
  carId: string | number;
  
  /**
   * Обробник натискання на зображення
   */
  onImagePress?: (image: CarImage) => void;
  
  /**
   * Обробник додавання зображення
   */
  onAddImage?: () => void;
  
  /**
   * Обробник видалення зображення
   */
  onDeleteImage?: (imageId: string | number) => void;
  
  /**
   * Максимальна кількість зображень для відображення
   */
  maxImages?: number;
}

/**
 * Дані для додавання зображення
 */
export interface AddImageData {
  /**
   * URL зображення
   */
  url: string;
  
  /**
   * Дата додавання зображення
   */
  date: string;
  
  /**
   * Опис зображення
   */
  description?: string;
}
