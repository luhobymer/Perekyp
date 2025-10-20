import React from 'react';
import { 
  ActivityIndicator, 
  Animated, 
  StyleProp, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ViewStyle, 
  TextStyle
} from 'react-native';
// Імпорти констант теми не потрібні, використовуємо локальні константи
import { useAnimation } from '../hooks/useAnimation';
import { responsiveTypography, getResponsiveValue } from '../styles/responsiveStyles';
import { useTheme } from '../hooks/useTheme';
import { ButtonProps } from '../types/components';

// Статичні кольори для кнопок (можуть бути перевизначені через тему)
const COLORS = {
  primary: '#2563EB',
  secondary: '#4F46E5',
  error: '#EF4444',
  white: '#FFFFFF',
  border: '#E2E8F0',
  textSecondary: '#64748B',
} as const;

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  style = {},
  textStyle = {},
  ...props
}) => {
  const { animation, start, reset } = useAnimation('buttonPress', {
    duration: 150,
  });
  
  const { theme } = useTheme();
  
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      paddingVertical: getResponsiveValue(size === 'small' ? 8 : 12, size === 'small' ? 10 : 14, size === 'small' ? 12 : 16),
      paddingHorizontal: getResponsiveValue(size === 'small' ? 16 : 24, size === 'small' ? 20 : 28, size === 'small' ? 24 : 32),
      borderRadius: getResponsiveValue(8, 10, 12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: getResponsiveValue(120, 140, 160),
      opacity: disabled ? 0.5 : 1,
    };

    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary || COLORS.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary || COLORS.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary || COLORS.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error || COLORS.error,
        };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: TextStyle = {
      ...responsiveTypography[size === 'small' ? 'body2' : 'body1'],
      textAlign: 'center',
    } as TextStyle;

    switch (type) {
      case 'primary':
      case 'danger':
        return {
          ...baseStyle,
          color: COLORS.white,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: theme.colors.text,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: theme.colors.primary || COLORS.primary,
        };
      default:
        return baseStyle;
    }
  };

  const handlePress = () => {
    if (disabled || loading) return;
    
    // Анімація натискання
    start(1);
    setTimeout(() => {
      reset();
      onPress();
    }, 150);
  };

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
    ],
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'outline' ? (theme.colors.primary || COLORS.primary) : COLORS.white} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
      
      {icon && iconPosition === 'right' && (
        <View style={[styles.iconContainer, { marginLeft: 8, marginRight: 0 }]}>
          {icon}
        </View>
      )}
    </>
  );

  return (
    <Animated.View style={[animatedStyle, { opacity: disabled ? 0.6 : 1 }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
});

export default Button;
