import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { tooltipAnimation } from '../animations/advancedAnimations';
import { useTheme } from '../hooks/useTheme';
import { SIZES, FONTS } from '../constants/theme';
import { responsiveTypography, getResponsiveValue } from '../styles/responsiveStyles';
import { TooltipProps, TooltipPosition } from '../types/components/tooltip';

/**
 * Компонент для відображення підказки
 */
const Tooltip: React.FC<TooltipProps> = ({
  message,
  position = 'bottom',
  duration = 3000,
  onClose,
  style,
  size = 'medium', // small, medium, large
}) => {
  const { theme } = useTheme();
  const { animation, start, stop } = useAnimation({
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
   * Отримання стилю позиції в залежності від параметра position
   */
  const getPositionStyle = () => {
    const margin = getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large);
    switch (position) {
      case 'top':
        return { bottom: '100%', marginBottom: margin };
      case 'bottom':
        return { top: '100%', marginTop: margin };
      case 'left':
        return { right: '100%', marginRight: margin };
      case 'right':
        return { left: '100%', marginLeft: margin };
      default:
        return { top: '100%', marginTop: margin };
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

  /**
   * Отримання максимальної ширини в залежності від розміру компонента
   */
  const getMaxWidth = (): number => {
    switch (size) {
      case 'small':
        return getResponsiveValue(150, 200, 250);
      case 'large':
        return getResponsiveValue(250, 300, 350);
      default:
        return getResponsiveValue(200, 250, 300);
    }
  };

  const animatedStyle = tooltipAnimation(animation);

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        {
          backgroundColor: theme.colors.primary,
          padding: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
          borderRadius: getResponsiveValue(SIZES.xs, SIZES.small, SIZES.medium),
          maxWidth: getMaxWidth(),
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
    position: 'absolute',
    zIndex: 1000,
  },
  text: {
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },
});

export default Tooltip;
