/**
 * Типи для екрану очищення даних
 */

/**
 * Інтерфейс для опції очищення
 */
export interface CleanOption {
  /**
   * Заголовок опції
   */
  title: string;
  
  /**
   * Опис опції
   */
  description: string;
  
  /**
   * Обробник натискання
   */
  onPress: () => void;
  
  /**
   * Чи відбувається завантаження
   */
  isLoading: boolean;
  
  /**
   * Назва іконки
   */
  iconName: string;
}
