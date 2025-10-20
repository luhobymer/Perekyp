import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../src/constants/theme';

export default function CustomTabBar() {
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
      external: true,
    },
    {
      name: 'expenses',
      label: 'Витрати',
      icon: 'cash',
      path: '/expenses',
      external: true,
    },
    {
      name: 'analytics',
      label: 'Аналітика',
      icon: 'stats-chart',
      path: '/(tabs)/explore',
    },
    {
      name: 'profile',
      label: 'Профіль',
      icon: 'person-circle',
      path: '/(tabs)/profile',
    },
  ];

  const handleTabPress = (path: string, external?: boolean) => {
    if (external) {
      // Для зовнішніх шляхів (не в межах вкладок)
      router.navigate(path as any);
    } else {
      // Для шляхів в межах вкладок
      router.push(path as any);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => handleTabPress(tab.path, tab.external)}
          activeOpacity={0.7}
        >
          <Ionicons
            size={28}
            name={isActive(tab.path) ? tab.icon : `${tab.icon}-outline`}
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
