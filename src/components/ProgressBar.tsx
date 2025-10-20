import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { progressAnimation } from '../animations/advancedAnimations';
import { useTheme } from '../hooks/useTheme';
import { SIZES } from '../constants/theme';
import { getResponsiveValue } from '../styles/responsiveStyles';
import { ProgressBarProps } from '../types/components/progressBar';

/**
 * Компонент для відображення індикатора прогресу
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  height = 4,
  duration = 300,
  style,
  size = 'medium', // small, medium, large
}) => {
  const { theme } = useTheme();
  const { animation, start } = useAnimation({
    duration,
    easing: Easing.out(Easing.ease),
  });

  useEffect(() => {
    start(progress);
  }, [progress, start]);

  /**
   * Отримання адаптивної висоти компонента
   */
  const getResponsiveHeight = (): number => {
    const baseHeight = typeof height === 'number' ? height : 4;
    switch (size) {
      case 'small':
        return getResponsiveValue(baseHeight * 0.75, baseHeight, baseHeight * 1.25);
      case 'large':
        return getResponsiveValue(baseHeight * 1.25, baseHeight * 1.5, baseHeight * 2);
      default:
        return getResponsiveValue(baseHeight, baseHeight * 1.25, baseHeight * 1.5);
    }
  };

  /**
   * Отримання адаптивного радіуса заокруглення
   */
  const getResponsiveBorderRadius = (): number => {
    const baseRadius = getResponsiveHeight() / 2;
    return getResponsiveValue(baseRadius * 0.8, baseRadius, baseRadius * 1.2);
  };

  const animatedStyle = progressAnimation(animation);

  return (
    <View
      style={[
        styles.container,
        {
          height: getResponsiveHeight(),
          borderRadius: getResponsiveBorderRadius(),
          backgroundColor: theme.colors.border,
          marginVertical: getResponsiveValue(SIZES.xs, SIZES.small, SIZES.medium),
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: getResponsiveBorderRadius(),
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;
