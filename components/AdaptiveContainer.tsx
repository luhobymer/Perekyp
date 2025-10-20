import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { isTablet } from '../src/utils/dimensions';
import { SIZES } from '../src/constants/theme';

interface AdaptiveContainerProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  tabletStyle?: ViewStyle;
  maxWidth?: number;
}

/**
 * Адаптивний контейнер, який змінює свій вигляд в залежності від типу пристрою
 */
export const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({ 
  children, 
  style, 
  tabletStyle,
  maxWidth = 600,
  ...props 
}) => {
  const isTabletDevice = isTablet();
  
  return (
    <View 
      style={[
        styles.container,
        isTabletDevice && styles.tabletContainer,
        isTabletDevice && tabletStyle,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabletContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: SIZES.medium,
  },
});

export default AdaptiveContainer;
