import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../constants/theme';
import { responsiveContainers, getResponsiveValue } from '../styles/responsiveStyles';
import LoadingShimmer from './LoadingShimmer';
import { OptimizedListProps } from '../types/components/optimizedList';

/**
 * Оптимізований компонент списку з підтримкою завантаження, оновлення та пагінації
 */
function OptimizedList<T>({
  data,
  renderItem,
  keyExtractor,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing = false,
  loading = false,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  style,
  numColumns = 1,
  initialNumToRender = 10,
  maxToRenderPerBatch = 10,
  windowSize = 5,
  removeClippedSubviews = true,
  getItemLayout,
  size = 'medium', // small, medium, large
}: OptimizedListProps<T>): JSX.Element {
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<T>>(null);

  /**
   * Обробник оновлення списку
   */
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  /**
   * Обробник досягнення кінця списку
   */
  const handleEndReached = useCallback(() => {
    if (onEndReached && !loading) {
      onEndReached();
    }
  }, [onEndReached, loading]);

  /**
   * Отримання розміру контейнера в залежності від розміру компонента
   */
  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return responsiveContainers.small;
      case 'large':
        return responsiveContainers.large;
      default:
        return responsiveContainers.medium;
    }
  };

  /**
   * Рендер футера списку з індикатором завантаження
   */
  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={[
        styles.footer,
        getContainerSize(),
      ]}>
        <ActivityIndicator 
          size={size === 'small' ? 'small' : 'large'}
          color={theme.colors.primary} 
        />
      </View>
    );
  };

  /**
   * Рендер заглушки завантаження
   */
  const renderLoadingPlaceholder = () => {
    if (!loading) return null;

    return (
      <View style={[
        styles.loadingContainer,
        getContainerSize(),
      ]}>
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingShimmer
            key={index}
            height={getResponsiveValue(80, 100, 120)}
            style={[
              styles.loadingItem,
              { marginBottom: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large) },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing || refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
          progressViewOffset={getResponsiveValue(SIZES.medium, SIZES.large, SIZES.xl)}
        />
      }
      ListEmptyComponent={
        loading ? renderLoadingPlaceholder : ListEmptyComponent
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      contentContainerStyle={[
        styles.contentContainer,
        getContainerSize(),
        contentContainerStyle,
      ]}
      style={[styles.container, style]}
      numColumns={numColumns}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      getItemLayout={getItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  footer: {
    padding: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    alignItems: 'center',
  },
  loadingContainer: {
    padding: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
  },
  loadingItem: {
    marginBottom: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
  },
});

export default OptimizedList;
