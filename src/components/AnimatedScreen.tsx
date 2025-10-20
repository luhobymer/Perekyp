import React, { useEffect, ReactNode } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

interface AnimatedScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const slideAnim = new Animated.Value(width);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
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