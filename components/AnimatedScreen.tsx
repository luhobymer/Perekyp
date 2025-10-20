import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { useNavigation } from 'expo-router';

type TransitionType = 'slideUp' | 'slideRight' | 'slideLeft' | 'slideDown' | 'scale' | 'fade';

interface AnimatedScreenProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  transition?: TransitionType;
  duration?: number;
}

/**
 * Компонент для анімованого переходу між екранами
 */
const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ 
  children, 
  style = {}, 
  transition = 'slideUp',
  duration = 300,
  ...props 
}) => {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анімація появи при монтуванні
    Animated.timing(animation, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();

    // Анімація зникнення при розмонтуванні
    return () => {
      Animated.timing(animation, {
        toValue: 0,
        duration: duration / 2,
        useNativeDriver: true,
      }).start();
    };
  }, [animation, duration]);

  // Вибір типу анімації
  const getAnimationStyle = (): ViewStyle => {
    switch (transition) {
      case 'slideUp':
        return {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: animation,
        };
      case 'slideRight':
        return {
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
        };
      case 'slideLeft':
        return {
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: animation,
        };
      case 'slideDown':
        return {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
        };
      case 'scale':
        return {
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animation,
        };
      case 'fade':
        return {
          opacity: animation,
        };
      default:
        return {
          opacity: animation,
        };
    }
  };

  return (
    <Animated.View style={[styles.container, getAnimationStyle(), style]} {...props}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedScreen;
