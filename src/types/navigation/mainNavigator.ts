/**
 * Типи для головного навігатора
 */

/**
 * Параметри для головного стеку навігації
 */
export type MainStackParamList = {
  /**
   * Навігатор автомобілів
   */
  CarsTab: { screen?: string; params?: any };
  
  /**
   * Екран налаштувань
   */
  Settings: undefined;
  
  /**
   * Екран аналітики
   */
  Analytics: undefined;
  
  /**
   * Екран профілю
   */
  Profile: undefined;
  
  /**
   * Екран очищення даних
   */
  Clean: undefined;
};
