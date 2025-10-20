/**
 * Типи для навігації в додатку
 */

/**
 * Параметри для стеку аутентифікації
 */
export type AuthStackParamList = {
  /**
   * Екран входу
   */
  Login: undefined;
  
  /**
   * Екран реєстрації
   */
  Register: undefined;
  
  /**
   * Екран відновлення паролю
   */
  ForgotPassword: undefined;
};

/**
 * Параметри для головного стеку
 */
export type MainStackParamList = {
  /**
   * Головний екран
   */
  Dashboard: undefined;
  
  /**
   * Список автомобілів
   */
  CarsList: undefined;
  
  /**
   * Деталі автомобіля
   */
  CarDetails: { carId: string };
  
  /**
   * Додавання/редагування автомобіля
   */
  AddEditCar: { carId?: string };
  
  /**
   * Список витрат
   */
  Expenses: { carId?: string };
  
  /**
   * Додавання/редагування витрати
   */
  AddEditExpense: { carId: string; expenseId?: string };
  
  /**
   * Список документів
   */
  Documents: { carId?: string };
  
  /**
   * Додавання/редагування документа
   */
  AddEditDocument: { carId: string; documentId?: string };
  
  /**
   * Аналітика
   */
  Analytics: undefined;
  
  /**
   * Профіль користувача
   */
  Profile: undefined;
  
  /**
   * Налаштування
   */
  Settings: undefined;
};
