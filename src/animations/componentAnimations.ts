import { Animated, Easing } from 'react-native';

/**
 * Типи анімацій для компонентів
 */
type AnimationValue = Animated.Value | Animated.ValueXY;
type AnimationStyle = {
  transform?: Array<any>;
  opacity?: Animated.AnimatedInterpolation;
  [key: string]: any;
};

/**
 * Анімація натискання кнопки
 * @param animation - Значення анімації
 */
export const buttonPressAnimation = (animation: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (animation as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };
};

/**
 * Анімація появи списку
 * @param value - Значення анімації
 * @param index - Індекс елемента в списку
 */
export const listItemAnimation = (value: AnimationValue, index: number): AnimationStyle => {
  return {
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [50 * (index + 1), 0],
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
 * Анімація для карток
 * @param value - Значення анімації
 */
export const cardAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
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
 * Анімація для модальних вікон
 * @param value - Значення анімації
 */
export const modalAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
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
 * Анімація для індикаторів завантаження
 * @param value - Значення анімації
 */
export const loadingAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        rotate: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };
};

/**
 * Анімація для перемикання вкладок
 * @param value - Значення анімації
 */
export const tabAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
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
 * Анімація для оновлення даних (pull-to-refresh)
 * @param value - Значення анімації
 */
export const refreshAnimation = (value: AnimationValue): AnimationStyle => {
  return {
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
};

export default {
  buttonPressAnimation,
  listItemAnimation,
  cardAnimation,
  modalAnimation,
  loadingAnimation,
  tabAnimation,
  refreshAnimation,
};
