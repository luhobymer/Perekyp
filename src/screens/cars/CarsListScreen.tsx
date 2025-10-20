import React, { useCallback, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ListRenderItemInfo, 
  RefreshControl, 
  Text,
  ViewStyle as RNViewStyle, 
  TextStyle as RNTextStyle,
  StyleProp as RNStyleProp
} from 'react-native';
import { useTranslation } from 'react-i18next';
// Імпортуємо необхідні компоненти з react-native-paper
import { Button, Card, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { Car } from '../../types';
import { useCars } from '../../hooks/useCars';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorMessage from '../../components/ErrorMessage';

// Використовуємо аліаси для уникнення конфліктів типів
type ViewStyle = RNViewStyle;
type TextStyle = RNTextStyle;
type StyleProp<T> = RNStyleProp<T>;

// Видаляємо зайві оголошення типів

interface CarsListScreenProps {
  containerStyle?: StyleProp<ViewStyle>;
  emptyStateStyle?: StyleProp<ViewStyle>;
  emptyStateTextStyle?: StyleProp<TextStyle>;
  loadingStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<ViewStyle>;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error, retry: () => void) => React.ReactNode;
  renderEmpty?: (onAddPress: () => void) => React.ReactNode;
  customRenderCarItem?: (car: Car) => React.ReactNode;
  renderCarItem?: (info: { item: Car; index: number; separators: any }) => React.ReactNode;
  onCarPress?: (car: Car) => void;
  onAddPress?: () => void;
  onDeleteCar?: (carId: string) => Promise<void>;
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  addButtonStyle?: StyleProp<ViewStyle>;
}

const CarsListScreen: React.FC<CarsListScreenProps> = (props) => {
  const {
    containerStyle,
    emptyStateStyle,
    emptyStateTextStyle,
    loadingStyle, 
    errorStyle,
    renderLoading,
    renderError,
    renderEmpty,
    renderCarItem: customRenderCarItem,
    onCarPress,
    onAddPress,
    onDeleteCar,
    showAddButton, 
    showDeleteButton,
    addButtonStyle,
  } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const { 
    cars = [], 
    loading: isCarsLoading, 
    error: carsError, 
    getCars: fetchCars
  } = useCars();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoading = isCarsLoading || isRefreshing;

  // Handle refresh action
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await fetchCars();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, fetchCars]);

  // Handle car press
  const _handleCarPress = useCallback((car: Car) => {
    if (onCarPress) {
      onCarPress(car);
    } else {
      router.push(`/cars/${car.id}`);
    }
  }, [onCarPress, router]);

  // Handle add press
  const handleAddPress = useCallback(() => {
    if (onAddPress) {
      onAddPress();
    } else {
      router.push('/cars/add');
    }
  }, [onAddPress, router]);

  // Handle delete car
  const _handleDeleteCar = useCallback(async (carId: string) => {
    if (onDeleteCar) {
      try {
        await onDeleteCar(carId);
      } catch (error: any) {
        console.error('Error deleting car:', error);
      }
    }
  }, [onDeleteCar]);

  // Render car item
  // Функція для рендеру елемента списку автомобілів
  const renderCarItem = (info: ListRenderItemInfo<Car>): JSX.Element => {
    // Деструктуризуємо item з інформації про елемент
    const { item } = info;

    const handlePress = () => _handleCarPress(item);
    const handleDelete = () => _handleDeleteCar(item.id);

    // Якщо надано кастомний рендер, використовуємо його
    if (customRenderCarItem) {
      const rendered = customRenderCarItem(item);
      return rendered ? <View>{rendered}</View> : <></>;
    }
    
    // Якщо надано рендер через props, використовуємо його
    if (renderCarItem) {
      const mockSeparators = {
        highlight: () => {},
        unhighlight: () => {},
        updateProps: () => {}
      };
      const rendered = renderCarItem({ item, index: 0, separators: mockSeparators } as any);
      return rendered ? <View>{rendered}</View> : <></>;
    }

    return (
      <Card style={styles.carCard} onPress={handlePress}>
        <Card.Content>
          <Text style={styles.carTitle}>{item.brand} {item.model}</Text>
          <Text style={styles.carDetails}>
            {item.year} • {item.licensePlate || t('cars.noLicensePlate')}
          </Text>
          {showDeleteButton && (
            <Button 
              mode="outlined" 
              onPress={handleDelete}
              style={styles.deleteButton}
              textColor="#ff3b30"
            >
              {t('common.delete')}
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyComponent = (): JSX.Element => {
    if (renderEmpty) {
      const rendered = renderEmpty(handleAddPress);
      return rendered ? <View>{rendered}</View> : <></>;
    }

    return (
      <View style={[styles.emptyContainer, emptyStateStyle]}>
        <Text style={[styles.emptyText, emptyStateTextStyle]}>
          {t('cars.noCarsTitle')}
        </Text>
        <Text style={styles.emptySubtext}>
          {t('cars.noCarsDescription')}
        </Text>
      </View>
    );
  };

  // Render loading state
  const renderLoadingComponent = (): JSX.Element | null => {
    if (!isLoading) return null;

    if (renderLoading) {
      return <View>{renderLoading()}</View>;
    }

    return (
      <View style={[styles.loadingContainer, loadingStyle]}>
        <LoadingIndicator />
      </View>
    );
  };

  // Render error state
  const renderErrorComponent = (): JSX.Element | null => {
    if (!carsError) return <></>;

    const errorMessage = 
      typeof carsError === 'string' 
        ? carsError 
        : 'Unknown error';

    if (renderError) {
      const errorObj = 
        carsError && typeof carsError === 'object' && 'message' in carsError
          ? carsError as Error
          : new Error(errorMessage);
          
      const rendered = renderError(errorObj, handleRefresh);
      return rendered ? <View>{rendered}</View> : <></>;
    }

    return (
      <View style={[styles.errorContainer, errorStyle]}>
        <ErrorMessage
          message={errorMessage}
          onRetry={handleRefresh}
        />
      </View>
    );
  };

  // Render add button
  const renderAddButton = (): JSX.Element | null => {
    if (!showAddButton) return null;

    return (
      <Button 
        mode="contained" 
        onPress={handleAddPress}
        style={[styles.addButton, addButtonStyle]}
        icon="plus"
      >
        {t('cars.addCar')}
      </Button>
    );
  };

  // Render main content
  const renderContent = (): JSX.Element => {
    if (carsError) {
      return renderErrorComponent() || <></>;
    }

    if (isLoading && !isRefreshing) {
      return renderLoadingComponent() || <></>;
    }

    return (
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyComponent : null}
        ListHeaderComponent={renderLoadingComponent()}
        ListFooterComponent={renderErrorComponent()}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderContent()}
      {renderAddButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    paddingBottom: 16,
  },
  carCard: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  carTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    borderColor: '#ff3b30',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingStyle: {
    // Empty style, can be customized via props
  },
  addButtonContainer: {
    padding: 16,
  },
  addButton: {
    borderRadius: 50,
    elevation: 4,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// Memoize the component to prevent unnecessary re-renders
const MemoizedCarsListScreen = React.memo(CarsListScreen);
export default MemoizedCarsListScreen;
