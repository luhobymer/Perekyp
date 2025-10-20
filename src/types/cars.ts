import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface CarSpecifications {
  transmission?: string;
  drive?: string;
  fuel?: string;
  consumption?: {
    city?: string;
    highway?: string;
    combined?: string;
  };
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
  };
  performance?: {
    acceleration?: string;
    topSpeed?: string;
    horsepower?: string;
    torque?: string;
  };
  safety?: string[];
  comfort?: string[];
  entertainment?: string[];
  other?: string[];
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  vin?: string;
  status?: 'active' | 'sold' | 'archived';
  images?: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  body_type?: string;
  reg_number?: string;
  engine_type?: string;
  engine_volume?: number;
  color?: string;
  purchase_date?: string;
  last_service_date?: string;
  next_service_date?: string;
  documents?: any[];
  expenses?: any[];
  specifications?: CarSpecifications;
  // Поля для сумісності з бекендом
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarFormData {
  id: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  vin: string;
  status: string;
  description: string;
  body_type: string;
  reg_number: string;
  engine_type: string;
  engine_volume: string;
  color: string;
  purchase_date: string;
  last_service_date: string;
  next_service_date: string;
  documents: any[];
  expenses: any[];
  images: string[];
  specifications: {
    transmission: string;
    drive: string;
    fuel: string;
    consumption: {
      city: string;
      highway: string;
      combined: string;
    };
    dimensions: {
      length: string;
      width: string;
      height: string;
      weight: string;
    };
    performance: {
      acceleration: string;
      topSpeed: string;
      horsepower: string;
      torque: string;
    };
    safety: string[];
    comfort: string[];
    entertainment: string[];
    other: string[];
  };
}

export interface CarsListScreenParams {
  status?: 'available' | 'sold' | 'reserved' | 'maintenance';
  brand?: string;
  model?: string;
  refresh?: boolean;
}

export interface CarsListScreenProps {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  emptyStateStyle?: StyleProp<ViewStyle>;
  emptyStateTextStyle?: StyleProp<TextStyle>;
  addButtonStyle?: StyleProp<ViewStyle>;
  addButtonTextStyle?: StyleProp<TextStyle>;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error, onRetry: () => void) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderCarCard?: (car: Car, onPress: () => void, onDelete?: () => void) => React.ReactNode;
  onCarPress?: (car: Car) => void;
  onAddPress?: () => void;
  onRefresh?: () => Promise<void> | void;
  showAddButton?: boolean;
  enablePullToRefresh?: boolean;
  showDeleteButton?: boolean;
  filterCars?: (cars: Car[]) => Car[];
  sortCars?: (cars: Car[]) => Car[];
}
