import React from 'react';
import { View, StyleSheet, FlatList, ViewStyle, FlatListProps } from 'react-native';
import { isTablet } from '../src/utils/dimensions';
import { SIZES } from '../src/constants/theme';

interface AdaptiveGridProps<T> extends Omit<FlatListProps<T>, 'numColumns'> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  numColumns?: number;
  tabletNumColumns?: number;
  spacing?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/**
 * Адаптивна сітка, яка змінює кількість колонок в залежності від типу пристрою
 */
export const AdaptiveGrid = <T extends any>({
  data,
  renderItem,
  numColumns = 1,
  tabletNumColumns = 2,
  spacing = SIZES.medium,
  style,
  contentContainerStyle,
  ...props
}: AdaptiveGridProps<T>) => {
  const isTabletDevice = isTablet();
  const columns = isTabletDevice ? tabletNumColumns : numColumns;

  const getItemLayout = (_data: T[] | null | undefined, index: number) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      numColumns={columns}
      keyExtractor={(_item, index) => index.toString()}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        styles.contentContainer,
        { padding: spacing },
        contentContainerStyle,
      ]}
      columnWrapperStyle={columns > 1 ? [
        styles.columnWrapper,
        { marginHorizontal: -spacing / 2 },
      ] : undefined}
      style={[styles.container, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});

export default AdaptiveGrid;
