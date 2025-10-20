import { Animated, Easing } from 'react-native';

/**
 * Типи анімацій для розширених ефектів
 */
type AnimationValue = Animated.Value | Animated.ValueXY;
type Direction = 'left' | 'right';
type AnimationStyle = {
  transform?: Array<any>;
  opacity?: Animated.AnimatedInterpolation;
  width?: Animated.AnimatedInterpolation;
  [key: string]: any;
};

/**
 * Анімація для свайпу елементів списку
 * @param value - Значення анімації
 * @param direction - Напрямок свайпу ('left' або 'right')
 */
export const swipeAnimation = (value: AnimationValue, direction: Direction = 'left'): AnimationStyle => {
  const translateX = direction === 'left' ? -100 : 100;
  return {
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [translateX, 0],
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
 * Анімація для відображення спливаючих підказок
 * @param value - Значення анімації
 */
export const tooltipAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
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
 * Анімація для відображення прогресу
 * @param value - Значення анімації
 */
export const progressAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    width: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };
};

/**
 * Анімація для відображення помилок
 * @param value - Значення анімації
 */
export const errorShakeAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, -10, 10, -10, 0],
        }),
      },
    ],
  };
};

/**
 * Анімація для відображення успішних дій
 * @param value - Значення анімації
 */
export const successAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1],
        }),
      },
    ],
  };
};

/**
 * Анімація для відображення завантаження
 * @param value - Значення анімації
 */
export const shimmerAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.7, 0.3],
    }),
  };
};

/**
 * Анімація для відображення переходів між станами
 * @param value - Значення анімації
 */
export const stateTransitionAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 1.1, 1],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
    }),
  };
};

/**
 * Анімація для відображення нагадувань
 * @param value - Значення анімації
 */
export const notificationAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-100, 0, 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
    }),
  };
};

export default {
  swipeAnimation,
  tooltipAnimation,
  progressAnimation,
  errorShakeAnimation,
  successAnimation,
  shimmerAnimation,
  stateTransitionAnimation,
  notificationAnimation,
};
