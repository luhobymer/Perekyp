import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LoadingIndicatorProps } from '../types/components/loadingIndicator';

/**
 * Індикатор завантаження з опціональним текстовим повідомленням.
 * Використовується для відображення стану завантаження в додатку.
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Завантаження...',
  containerStyle,
  textStyle,
  size = 'large',
  showMessage = true,
  color,
  indicatorProps = {},
  textProps = {}
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
      <ActivityIndicator 
        size={size} 
        color={color || colors.primary} 
        accessibilityLabel="Завантаження"
        {...indicatorProps}
      />
      {showMessage && message && (
        <Text 
          style={[styles.message, { color: colors.text }, textStyle]}
          accessibilityRole="text"
          {...textProps}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '500',
  },
});

export default LoadingIndicator;
