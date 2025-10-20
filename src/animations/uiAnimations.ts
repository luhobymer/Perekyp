import { Animated, Easing } from 'react-native';

/**
 * Типи для анімацій інтерфейсу
 */
type AnimationValue = Animated.Value | Animated.ValueXY;
type Direction = 'left' | 'right';
type AnimationStyle = {
  transform?: Array<any>;
  opacity?: Animated.AnimatedInterpolation;
  height?: Animated.AnimatedInterpolation;
  [key: string]: any;
};

type AnimationConfig = {
  duration?: number;
  delay?: number;
  easing?: any;
  useNativeDriver?: boolean;
};

/**
 * Анімації для галереї зображень
 */
export const galleryAnimations = {
  /**
   * Збільшення зображення при натисканні
   * @param value - Значення анімації
   */
  imageZoom: (value: AnimationValue): AnimationStyle => ({
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  }),

  /**
   * Плавний перехід між зображеннями
   * @param value - Значення анімації
   * @param direction - Напрямок переходу ('right' або 'left')
   */
  imageTransition: (value: AnimationValue, direction: Direction = 'right'): AnimationStyle => ({
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [direction === 'right' ? 300 : -300, 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),

  /**
   * Анімація завантаження зображення
   * @param value - Значення анімації
   */
  imageLoading: (value: AnimationValue): AnimationStyle => ({
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.7, 0.3],
    }),
    transform: [
      {
        scale: (value as Animated.Value).interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.95, 1, 0.95],
        }),
      },
    ],
  }),
};

/**
 * Анімації для форм
 */
export const formAnimations = {
  /**
   * Плавна поява полів вводу
   * @param value - Значення анімації
   * @param index - Індекс поля у формі
   */
  fieldAppear: (value: AnimationValue, index: number): AnimationStyle => ({
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [20 * (index + 1), 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),

  /**
   * Анімація валідації
   * @param value - Значення анімації
   */
  validationShake: (value: AnimationValue): AnimationStyle => ({
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, -10, 10, -10, 0],
        }),
      },
    ],
  }),

  /**
   * Анімація автозаповнення
   * @param value - Значення анімації
   */
  autocompleteAppear: (value: AnimationValue): AnimationStyle => ({
    transform: [
      {
        translateY: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),
};

/**
 * Анімації для фільтрів та пошуку
 */
export const filterAnimations = {
  /**
   * Розкриття/згортання панелі фільтрів
   * @param value - Значення анімації
   */
  filterPanel: (value: AnimationValue): AnimationStyle => ({
    height: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200],
    }),
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),

  /**
   * Анімація результатів пошуку
   * @param value - Значення анімації
   * @param index - Індекс результату пошуку
   */
  searchResults: (value: AnimationValue, index: number): AnimationStyle => ({
    transform: [
      {
        translateX: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: [-50 * (index + 1), 0],
        }),
      },
    ],
    opacity: (value as Animated.Value).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),

  /**
   * Анімація сортування
   * @param value - Значення анімації
   */
  sortAnimation: (value: AnimationValue): AnimationStyle => ({
    transform: [
      {
        rotate: (value as Animated.Value).interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  }),
};

/**
 * Допоміжні функції для створення анімацій
 * @param value - Значення анімації
 * @param config - Конфігурація анімації
 */
export const createAnimation = (
  value: AnimationValue, 
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  const {
    duration = 300,
    delay = 0,
    easing = Easing.inOut(Easing.ease),
    useNativeDriver = true,
  } = config;

  return Animated.timing(value, {
    toValue: 1,
    duration,
    delay,
    easing,
    useNativeDriver,
  });
};

/**
 * Функція для створення послідовності анімацій
 * @param animations - Масив анімацій
 */
export const createSequence = (
  animations: Array<Animated.CompositeAnimation>
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

/**
 * Функція для створення паралельних анімацій
 * @param animations - Масив анімацій
 */
export const createParallel = (
  animations: Array<Animated.CompositeAnimation>
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

export default {
  galleryAnimations,
  formAnimations,
  filterAnimations,
  createAnimation,
  createSequence,
  createParallel,
};
