import { useRef, useCallback } from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';

// Типи для анімації
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  useNativeDriver?: boolean;
}

export interface AnimationHook {
  animation: Animated.Value;
  start: (toValue?: number, callback?: () => void) => void;
  reset: () => void;
  stop: () => void;
}

export interface SequenceAnimationHook {
  animationValues: Animated.Value[];
  start: () => void;
  reset: () => void;
  stop: () => void;
}

export interface ParallelAnimationHook {
  animationValues: Animated.Value[];
  start: () => void;
  reset: () => void;
  stop: () => void;
}

// Базовий хук для анімації
export const useAnimation = (
  type: string = 'default', 
  config: AnimationConfig = {
    duration: 300,
    delay: 0,
    easing: Easing.ease, // Використовуємо простий Easing.ease, який є в обох версіях
    useNativeDriver: true
  }
): AnimationHook => {
  const animation = useRef(new Animated.Value(1)).current;

  const start = useCallback((toValue: number = 1, callback: () => void = () => {}) => {
    Animated.timing(animation, {
      toValue,
      duration: config.duration,
      delay: config.delay,
      easing: config.easing,
      useNativeDriver: config.useNativeDriver
    }).start(callback);
  }, [animation, config]);

  const reset = useCallback(() => {
    animation.setValue(1);
  }, [animation]);

  const stop = useCallback(() => {
    animation.stopAnimation();
  }, [animation]);

  return {
    animation,
    start,
    reset,
    stop
  };
};

// Хук для послідовних анімацій
export const useSequenceAnimation = (
  animations: any[] = [], 
  config: AnimationConfig = {}
): SequenceAnimationHook => {
  const {
    duration = 300,
    delay = 0,
    easing = Easing.inOut(Easing.ease),
    useNativeDriver = true,
  } = config;

  const animationValues = animations.map(() => useRef(new Animated.Value(0)).current);

  const start = (): void => {
    const sequence = animations.map((animation, index) => {
      return Animated.timing(animationValues[index], {
        toValue: 1,
        duration,
        delay: delay + index * duration,
        easing,
        useNativeDriver,
      });
    });

    Animated.sequence(sequence).start();
  };

  const reset = (): void => {
    animationValues.forEach(value => value.setValue(0));
  };

  const stop = (): void => {
    animationValues.forEach(value => value.stopAnimation());
  };

  return {
    animationValues,
    start,
    reset,
    stop,
  };
};

// Хук для паралельних анімацій
export const useParallelAnimation = (
  animations: any[] = [], 
  config: AnimationConfig = {}
): ParallelAnimationHook => {
  const {
    duration = 300,
    delay = 0,
    easing = Easing.inOut(Easing.ease),
    useNativeDriver = true,
  } = config;

  const animationValues = animations.map(() => useRef(new Animated.Value(0)).current);

  const start = (): void => {
    const parallel = animations.map((animation, index) => {
      return Animated.timing(animationValues[index], {
        toValue: 1,
        duration,
        delay,
        easing,
        useNativeDriver,
      });
    });

    Animated.parallel(parallel).start();
  };

  const reset = (): void => {
    animationValues.forEach(value => value.setValue(0));
  };

  const stop = (): void => {
    animationValues.forEach(value => value.stopAnimation());
  };

  return {
    animationValues,
    start,
    reset,
    stop,
  };
};

export default {
  useAnimation,
  useSequenceAnimation,
  useParallelAnimation,
};
