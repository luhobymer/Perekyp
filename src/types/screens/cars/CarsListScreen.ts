import { StyleProp, ViewStyle, TextStyle, ImageStyle, ListRenderItem } from 'react-native';
import { Car } from '../..';

/**
 * Navigation parameters for the cars list screen
 */
export interface CarsListScreenParams {
  /**
   * Filter by car status
   */
  status?: 'active' | 'sold' | 'archived';
  
  /**
   * Filter by brand
   */
  brand?: string;
  
  /**
   * Filter by model
   */
  model?: string;
  
  /**
   * Whether to refresh data on load
   */
  refresh?: boolean;
}

/**
 * Props for the CarsListScreen component
 */
export interface CarsListScreenProps {
  /**
   * Additional container style
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional content container style
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional header style
   */
  headerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional list style
   */
  listStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional car card style
   */
  carCardStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional empty state style
   */
  emptyStateStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional empty state text style
   */
  emptyStateTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Additional add button style
   */
  addButtonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional add button text style
   */
  addButtonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Custom loading indicator component
   */
  renderLoading?: () => React.ReactNode;
  
  /**
   * Custom error component
   * @param error Error object
   * @param onRetry Function to retry the operation
   */
  renderError?: (error: Error, onRetry: () => void) => React.ReactNode;
  
  /**
   * Custom empty state component
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Custom car card renderer
   * @param car Car object
   * @param onPress Handler for card press
   * @param onDelete Handler for delete action
   */
  renderCarCard?: (car: Car, onPress: () => void, onDelete?: () => void) => React.ReactNode;
  
  /**
   * Handler for car card press
   * @param car Car object
   */
  onCarPress?: (car: Car) => void;
  
  /**
   * Handler for add button press
   */
  onAddPress?: () => void;
  
  /**
   * Handler for refresh (pull-to-refresh)
   */
  onRefresh?: () => Promise<void> | void;
  
  /**
   * Whether to show the add button
   * @default true
   */
  showAddButton?: boolean;
  
  /**
   * Whether to enable pull-to-refresh
   * @default true
   */
  enablePullToRefresh?: boolean;
  
  /**
   * Whether to show delete button on car cards
   * @default true
   */
  showDeleteButton?: boolean;
  
  /**
   * Custom filter function for cars
   * @param cars Array of cars to filter
   * @returns Filtered array of cars
   */
  filterCars?: (cars: Car[]) => Car[];
  
  /**
   * Custom sort function for cars
   * @param cars Array of cars to sort
   * @returns Sorted array of cars
   */
  sortCars?: (cars: Car[]) => Car[];
}

/**
 * Props for the CarCard component
 */
export interface CarCardProps {
  /**
   * Car object
   */
  car: Car;
  
  /**
   * Additional container style
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Additional image style
   */
  imageStyle?: StyleProp<ImageStyle>;
  
  /**
   * Additional content style
   */
  contentStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional title style
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Additional subtitle style
   */
  subtitleStyle?: StyleProp<TextStyle>;
  
  /**
   * Additional price style
   */
  priceStyle?: StyleProp<TextStyle>;
  
  /**
   * Additional status style
   */
  statusStyle?: StyleProp<ViewStyle>;
  
  /**
   * Additional status text style
   */
  statusTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Handler for card press
   */
  onPress?: () => void;
  
  /**
   * Handler for delete action
   */
  onDelete?: () => void;
  
  /**
   * Whether to show actions (edit/delete buttons)
   * @default false
   */
  showActions?: boolean;
  
  /**
   * Handler for edit button press
   */
  onEditPress?: () => void;
  
  /**
   * Whether to show loading indicator
   * @default false
   */
  loading?: boolean;
  
  /**
   * Custom image renderer
   */
  renderImage?: (imageUrl: string, style: StyleProp<ImageStyle>) => React.ReactNode;
  
  /**
   * Custom title renderer
   */
  renderTitle?: (title: string, style?: StyleProp<TextStyle>) => React.ReactNode;
  
  /**
   * Custom subtitle renderer
   */
  renderSubtitle?: (subtitle: string, style?: StyleProp<TextStyle>) => React.ReactNode;
  
  /**
   * Custom price renderer
   */
  renderPrice?: (price: number, style?: StyleProp<TextStyle>) => React.ReactNode;
  
  /**
   * Custom status renderer
   */
  renderStatus?: (
    status: string, 
    style?: StyleProp<ViewStyle>, 
    textStyle?: StyleProp<TextStyle>
  ) => React.ReactNode;
}
