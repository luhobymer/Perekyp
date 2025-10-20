import React, { useEffect } from 'react';
import { Text, StyleSheet, Animated, Easing } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { errorShakeAnimation, successAnimation } from '../animations/advancedAnimations';
import { useTheme } from '../hooks/useTheme';
import { SIZES, FONTS } from '../constants/theme';
import { responsiveTypography, getResponsiveValue } from '../styles/responsiveStyles';
import { StatusMessageProps } from '../types/components/statusMessage';

/**
 * Компонент для відображення повідомлення про статус
 */
const StatusMessage: React.FC<StatusMessageProps> = ({
  type = 'success',
  message,
  duration = 3000,
  onClose,
  style,
  size = 'medium', // small, medium, large
}) => {
  const { theme } = useTheme();
  const { animation, start, stop } = useAnimation('default', {
    duration: 300,
    easing: Easing.out(Easing.ease),
  });

  useEffect(() => {
    start();
    const timer = setTimeout(() => {
      stop();
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [duration, onClose, start, stop]);

  /**
   * Отримання кольору фону в залежності від типу повідомлення
   */
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  /**
   * Отримання стилю тексту в залежності від розміру компонента
   */
  const getMessageStyle = () => {
    switch (size) {
      case 'small':
        return responsiveTypography.caption;
      case 'large':
        return responsiveTypography.subtitle;
      default:
        return responsiveTypography.body;
    }
  };

  const animatedStyle = type === 'error'
    ? errorShakeAnimation(animation)
    : successAnimation(animation);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          padding: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
          borderRadius: getResponsiveValue(SIZES.xs, SIZES.small, SIZES.medium),
          marginVertical: getResponsiveValue(SIZES.xs, SIZES.small, SIZES.medium),
        },
        animatedStyle,
        style,
      ]}
    >
      <Text 
        style={[
          styles.text,
          getMessageStyle(),
          { color: theme.colors.background },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
    fontWeight: FONTS.weights.medium as any,
  },
});

export default StatusMessage;
