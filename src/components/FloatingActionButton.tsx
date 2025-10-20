import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  Modal,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { FloatingActionButtonProps, FABAction } from '../types/components/floatingActionButton';

// Для web-версії використовуємо власний Platform
if (typeof window !== 'undefined' && typeof Platform === 'undefined') {
  (window as any).Platform = {
    OS: 'web',
    select: (config: any) => config.web || config.default
  };
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ actions = [], style }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const toggleMenu = (): void => {
    const toValue = isOpen ? 0 : 1;

    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const handleActionPress = (action: FABAction): void => {
    toggleMenu();
    setTimeout(() => {
      action.onPress && action.onPress();
    }, 300);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <Animated.View 
            style={[
              styles.backdrop, 
              { opacity: modalOpacity, backgroundColor: 'rgba(0,0,0,0.4)' }
            ]}
          />
        </TouchableWithoutFeedback>
      )}
      
      <Animated.View style={styles.menuContainer}>
        {isOpen && actions.map((action, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [100, -10 - (actions.length - index - 1) * 60],
          });

          const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.actionButton,
                {
                  transform: [{ translateY }],
                  opacity,
                  backgroundColor: action.color || COLORS.card,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.actionTouchable}
                onPress={() => handleActionPress(action)}
              >
                <View style={styles.actionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: action.iconBg || COLORS.primary }]}>
                    <Ionicons
                      name={action.icon as any}
                      size={20}
                      color={action.iconColor || COLORS.white}
                    />
                  </View>
                  <Text style={[styles.actionText, { color: COLORS.text }]}>
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 105,
    minWidth: 170,
  },
  actionTouchable: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  action: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  actionText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
    maxWidth: 140,
  },
});

export default FloatingActionButton;
