import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useOfflineStore } from '../utils/offlineManager';
import { ThemeContext } from '../contexts/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';
import { responsiveTypography, getResponsiveValue } from '../styles/responsiveStyles';
import { useAnimation } from '../hooks/useAnimation';
import { slideDownAnimation } from '../animations/advancedAnimations';
import { OfflineStatusProps } from '../types/components/offlineStatus';

/**
 * Компонент для відображення статусу офлайн режиму
 */
const OfflineStatus: React.FC<OfflineStatusProps> = ({ containerStyle }) => {
  // Використовуємо useContext напряму, щоб мати можливість перевірити наявність контексту
  const themeContext = useContext(ThemeContext);
  const { isOnline, isSyncing, pendingOperations } = useOfflineStore();
  
  const { animation, start } = useAnimation({
    duration: 300,
    easing: Easing.out(Easing.ease),
  });

  useEffect(() => {
    if (!isOnline || isSyncing) {
      start();
    }
  }, [isOnline, isSyncing, start]);

  // Якщо контекст теми недоступний або онлайн і не синхронізується, не рендеримо нічого
  if (!themeContext || (isOnline && !isSyncing)) return null;
  
  // Отримуємо тему з контексту
  const { theme } = themeContext;

  const animatedStyle = slideDownAnimation(animation);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isOnline 
            ? theme.colors.primary 
            : theme.colors.error,
        },
        animatedStyle,
        containerStyle,
      ]}
    >
      <Text style={[
        styles.text,
        responsiveTypography.caption,
        { color: theme.colors.background },
      ]}>
        {isOnline 
          ? `Синхронізація... (${pendingOperations.length} операцій)`
          : 'Офлайн режим'
        }
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },
});

export default OfflineStatus;
