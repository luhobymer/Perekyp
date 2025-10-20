/**
 * Типи для даних про марки автомобілів
 */

/**
 * Інтерфейс для об'єкту з марками та моделями автомобілів
 */
export interface CarBrandsData {
  [brand: string]: string[];
}

/**
 * Інтерфейс для об'єкту з відсортованими марками та моделями автомобілів
 */
export interface SortedCarBrandsData {
  [brand: string]: string[];
}
