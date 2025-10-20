import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { shimmerAnimation } from '../animations/advancedAnimations';
import { useTheme } from '../hooks/useTheme';
import { getResponsiveValue } from '../styles/responsiveStyles';
import { LoadingShimmerProps } from '../types/components/loadingShimmer';

/**
 * Компонент для відображення анімації завантаження
 */
const LoadingShimmer: React.FC<LoadingShimmerProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  size = 'medium', // small, medium, large
}) => {
  const { theme } = useTheme();
  const { animation, start } = useAnimation({
    duration: 1500,
    easing: Easing.linear,
  });

  useEffect(() => {
    start();
  }, []);

  /**
   * Отримання адаптивної висоти компонента
   */
  const getResponsiveHeight = (): number => {
    const baseHeight = typeof height === 'number' ? height : 20;
    switch (size) {
      case 'small':
        return getResponsiveValue(baseHeight * 0.8, baseHeight, baseHeight * 1.2);
      case 'large':
        return getResponsiveValue(baseHeight * 1.2, baseHeight * 1.5, baseHeight * 1.8);
      default:
        return getResponsiveValue(baseHeight, baseHeight * 1.2, baseHeight * 1.5);
    }
  };

  /**
   * Отримання адаптивного радіуса заокруглення
   */
  const getResponsiveBorderRadius = (): number => {
    const baseRadius = typeof borderRadius === 'number' ? borderRadius : 4;
    return getResponsiveValue(
      baseRadius * 0.8,
      baseRadius,
      baseRadius * 1.2
    );
  };

  const animatedStyle = shimmerAnimation(animation);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height: getResponsiveHeight(),
          borderRadius: getResponsiveBorderRadius(),
          backgroundColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: theme.colors.background,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
});

export default LoadingShimmer;
