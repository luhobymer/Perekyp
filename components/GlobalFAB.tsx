import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { BOTTOM_BAR_HEIGHT } from './GlobalBottomBar';
import { useTranslation } from 'react-i18next';

export const FAB_SIZE = 56;

export default function GlobalFAB() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Визначаємо, чи потрібно показувати FAB на поточній сторінці
  const shouldShowFAB = () => {
    return pathname.includes('cars') || pathname.includes('analytics');
  };

  // Визначаємо дію при натисканні на FAB в залежності від сторінки
  const handlePress = () => {
    if (pathname.includes('cars')) {
      router.push('/cars/add' as any);
    } else if (pathname.includes('analytics')) {
      router.push('/analytics/create' as any);
    }
  };

  // Отримуємо текст для тултіпа в залежності від сторінки
  const getTooltipText = () => {
    if (pathname.includes('cars')) {
      return t('add_new_car');
    } else if (pathname.includes('analytics')) {
      return t('add_new_analytics');
    }
    return t('add_new_item');
  };

  if (!shouldShowFAB()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityLabel={getTooltipText()}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? BOTTOM_BAR_HEIGHT + 10 : BOTTOM_BAR_HEIGHT + 5,
    right: 20,
    zIndex: 100,
  },
  button: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 