import { Animated } from 'react-native';

/**
 * Типи для анімацій переходів між екранами
 */
type AnimationValue = Animated.Value | Animated.ValueXY;
type TransitionDirection = 'left' | 'right' | 'up' | 'down';
type AnimationStyle = {
  transform?: Array<any>;
  opacity?: Animated.AnimatedInterpolation;
  [key: string]: any;
};

/**
 * Базова анімація переходу між екранами
 * @param value - Значення анімації
 * @param direction - Напрямок переходу
 */
export const baseTransition = (
  value: AnimationValue, 
  direction: TransitionDirection = 'right'
): AnimationStyle => {
  const getTranslation = () => {
    switch (direction) {
      case 'left':
        return { translateX: -300 };
      case 'right':
        return { translateX: 300 };
      case 'up':
        return { translateY: -300 };
      case 'down':
        return { translateY: 300 };
      default:
        return { translateX: 300 };
    }
  };

  const { translateX, translateY } = getTranslation();

  return {
    transform: [
      translateX !== undefined
        ? {
            translateX: (value as Animated.Value).interpolate({
              inputRange: [0, 1],
              outputRange: [translateX, 0],
            }),
          }
        : {
            translateY: (value as Animated.Value).interpolate({
              inputRange: [0, 1],
              outputRange: [translateY!, 0],
            }),
          },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
};

/**
 * Анімація переходу з затуханням
 * @param value - Значення анімації
 */
export const fadeTransition = (value: AnimationValue): AnimationStyle => {
  return {
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
};

/**
 * Анімація переходу зі збільшенням
 * @param value - Значення анімації
 */
export const scaleTransition = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
};

/**
 * Анімація переходу з поворотом
 * @param value - Значення анімації
 * @param direction - Напрямок повороту
 */
export const rotateTransition = (
  value: AnimationValue, 
  direction: 'clockwise' | 'counterclockwise' = 'clockwise'
): AnimationStyle => {
  const rotateDirection = direction === 'clockwise' ? '90deg' : '-90deg';
  
  return {
    transform: [
      {
        rotate: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [rotateDirection, '0deg'],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
};

/**
 * Анімація переходу з перспективою
 * @param value - Значення анімації
 */
export const perspectiveTransition = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        perspective: 1000,
      },
      {
        rotateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: ['90deg', '0deg'],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    }),
  };
};

/**
 * Анімація переходу з розмиттям
 * @param value - Значення анімації
 */
export const blurTransition = (value: AnimationValue): AnimationStyle => {
  return {
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [1.1, 1],
        }),
      },
    ],
  };
};

export default {
  baseTransition,
  fadeTransition,
  scaleTransition,
  rotateTransition,
  perspectiveTransition,
  blurTransition,
};
