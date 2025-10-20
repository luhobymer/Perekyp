import { StyleProp, TextProps, TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export type CarStatus = 'checking' | 'purchased' | 'repairing' | 'sold' | 'active' | 'reserved' | 'service' | string;

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image_url?: string;
  purchase_price?: number;
  selling_price?: number;
  status: CarStatus;
  total_expenses?: number;
  mileage?: number;
  vin?: string;
  license_plate?: string;
  color?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string | null;
  maxLength?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

export interface LoadingIndicatorProps {
  /**
   * Опціональне повідомлення, яке відображається під індикатором завантаження
   * @default 'Завантаження...'
   */
  message?: string;
}

export interface CarCardProps {
  /**
   * Об'єкт з даними про автомобіль
   */
  car: Car;
  
  /**
   * Функція, яка викликається при натисканні на картку
   */
  onPress: () => void;
  
  /**
   * Опціональна функція для видалення автомобіля
   */
  onDelete?: () => void;
  
  /**
   * Індекс картки для анімації (опціонально)
   * @default 0
   */
  index?: number;
}

export interface CarInfoProps {
  /**
   * Об'єкт з даними про автомобіль
   */
  car: Car;
  
  /**
   * Функція, яка викликається при оновленні інформації про автомобіль
   */
  onUpdate?: (updatedCar: Partial<Car>) => void;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  location?: string;
  notes?: string;
  startDate: Date;
  endDate: Date;
  calendarId?: string;
  eventId?: string;
}

export interface EventFormProps {
  /**
   * Об'єкт події для редагування (опціонально)
   */
  event?: CalendarEvent;
  
  /**
   * Функція, яка викликається при збереженні події
   */
  onSave: () => void;
  
  /**
   * Функція, яка викликається при скасуванні
   */
  onCancel: () => void;
}

/**
 * Типи документів
 */
export type DocumentType = 'registration' | 'insurance' | 'maintenance' | 'inspection' | 'other' | 'passport' | 'technical_inspection' | 'customs_declaration' | 'certificate_of_origin' | 'commercial_invoice' | 'bill_of_lading' | 'waybill' | 'delivery_note' | 'packing_list' | 'weight_note' | 'quality_certificate' | 'analysis_report' | 'test_report' | 'expert_report' | 'act_of_destruction' | 'act_of_disposal' | 'other_document';

/**
 * Інтерфейс документа
 */
export interface Document {
  id: string;
  car_id: string;
  carId: string; // For backward compatibility
  type: DocumentType;
  document_type: string; // Actual field from API
  title: string;        // Actual field from API
  file_url: string;     // Actual field from API
  file_type?: string;   // Actual field from API
  file_name?: string;   // Actual field from API
  file_size?: number;   // Actual field from API
  description?: string; // Optional field
  number?: string;      // Optional field
  date?: string | Date; // Optional field
  expiry_date?: string; // Optional field
  created_at: string;   // Required field from API
  updated_at: string;   // Required field from API
  createdAt?: string;   // For backward compatibility
  updatedAt?: string;   // For backward compatibility
  syncStatus?: 'pending' | 'synced' | 'error';
  
  // Additional fields that might be present
  [key: string]: any;
}

/**
 * Пропси компонента DocumentsList
 */
export interface DocumentsListProps {
  /**
   * ID автомобіля, до якого належать документи
   */
  carId: string;
  
  /**
   * Об'єкт навігації (опціонально, якщо використовується в навігаційному контексті)
   */
  navigation?: any; // TODO: Замінити на більш конкретний тип навігації
}

/**
 * Параметри для фільтрації документів
 */
export interface DocumentsFilterParams {
  type?: DocumentType | 'all';
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}
