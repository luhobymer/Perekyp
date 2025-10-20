/**
 * Типи для навігатора автомобілів
 */

/**
 * Параметри для стеку навігації автомобілів
 */
export type CarsStackParamList = {
  /**
   * Екран списку автомобілів
   */
  CarsList: undefined;
  
  /**
   * Екран додавання автомобіля
   */
  AddCar: undefined;
  
  /**
   * Екран деталей автомобіля
   */
  CarDetails: {
    carId: string;
    carTitle?: string;
  };
  
  /**
   * Екран фотографій автомобіля
   */
  CarImages: {
    carId: string;
    images?: string[];
  };
  
  /**
   * Екран історії пробігу автомобіля
   */
  CarMileageHistory: {
    carId: string;
  };
  
  /**
   * Екран документів автомобіля
   */
  CarDocuments: {
    carId: string;
  };
  
  /**
   * Екран витрат автомобіля
   */
  CarExpenses: {
    carId: string;
    carTitle?: string;
  };
  
  /**
   * Екран додавання витрати
   */
  AddExpense: {
    carId: string;
  };
  
  /**
   * Екран продажу автомобіля
   */
  SellCar: {
    carId: string;
    carTitle?: string;
  };
};
