import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type CarStatus = 
  | 'active' 
  | 'sold' 
  | 'reserved' 
  | 'service' 
  | 'checking' 
  | 'purchased' 
  | 'repairing';

export interface CarImage {
  id: string;
  url: string;
  isMain?: boolean;
  createdAt?: string;
}

export interface CarSpecification {
  id: string;
  name: string;
  value: string | number;
  icon?: string;
}

export interface CarEvent {
  id: string;
  type: string;
  title: string;
  date: string;
  description?: string;
  mileage?: number;
  cost?: number;
  location?: string;
  documents?: string[];
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
  mileage?: number;
  price?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  salePrice?: number;
  saleDate?: string;
  status: CarStatus;
  description?: string;
  images?: CarImage[];
  specifications?: CarSpecification[];
  events?: CarEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CarInfoProps {
  /**
   * Об'єкт з даними про автомобіль
   */
  car: Car;
  
  /**
   * Чи відображати кнопки дій
   * @default true
   */
  showActions?: boolean;
  
  /**
   * Обробник натискання на кнопку редагування
   */
  onEditPress?: (carId: string) => void;
  
  /**
   * Обробник натискання на кнопку видалення
   */
  onDeletePress?: (carId: string) => void;
  
  /**
   * Обробник зміни статусу автомобіля
   */
  onStatusChange?: (carId: string, newStatus: CarStatus) => void;
  
  /**
   * Додаткові стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для опису
   */
  descriptionStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для ціни
   */
  priceStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопок дій
   */
  actionButtonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопок дій
   */
  actionButtonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Чи відображати повний опис (без обрізання)
   * @default false
   */
  showFullDescription?: boolean;
  
  /**
   * Максимальна довжина опису перед обрізанням (символів)
   * @default 150
   */
  maxDescriptionLength?: number;
  
  /**
   * Чи відображати галерею зображень
   * @default true
   */
  showGallery?: boolean;
  
  /**
   * Чи відображати специфікації
   * @default true
   */
  showSpecifications?: boolean;
  
  /**
   * Чи відображати події
   * @default true
   */
  showEvents?: boolean;
}
