import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../src/constants/theme';

// Висота нижнього меню залежно від платформи
export const BOTTOM_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

export default function GlobalBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'home',
      label: 'Головна',
      icon: 'home',
      path: '/(tabs)/',
    },
    {
      name: 'cars',
      label: 'Авто',
      icon: 'car',
      path: '/cars',
    },
    {
      name: 'expenses',
      label: 'Витрати',
      icon: 'cash',
      path: '/expenses',
    },
    {
      name: 'analytics',
      label: 'Аналітика',
      icon: 'stats-chart',
      path: '/analytics',
    },
    {
      name: 'profile',
      label: 'Профіль',
      icon: 'person-circle',
      path: '/(tabs)/profile',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/(tabs)/' && pathname === '/') return true;
    if (path === '/cars' && pathname.includes('cars')) return true;
    if (path === '/expenses' && pathname.includes('expenses')) return true;
    if (path === '/analytics' && pathname.includes('analytics')) return true;
    if (path === '/(tabs)/profile' && pathname.includes('profile')) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => router.push(tab.path as any)}
          activeOpacity={0.7}
        >
          <Ionicons
            size={28}
            name={isActive(tab.path) ? tab.icon as any : `${tab.icon}-outline` as any}
            color={isActive(tab.path) ? COLORS.primary : '#8E8E93'}
          />
          <Text
            style={[
              styles.label,
              { color: isActive(tab.path) ? COLORS.primary : '#8E8E93' },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 8, // Для Android, щоб меню було над контентом
    shadowColor: '#000', // Для iOS, щоб меню було над контентом
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
