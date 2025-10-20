import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../src/hooks/useColorScheme';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { useRouter, router } from 'expo-router';
import CustomTabBar from './CustomTabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme?.colors?.card || '#FFFFFF',
          },
          headerTintColor: theme?.colors?.text || '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Приховуємо стандартний tabBar, оскільки ми використовуємо власний
          tabBarStyle: { display: 'none' },
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: t('home', 'Головна'),
            headerTitle: t('home', 'Головна'),
          }}
        />
        <Tabs.Screen
          name="cars"
          options={{
            title: t('cars', 'Авто'),
            headerTitle: t('cars', 'Авто'),
            href: '/cars',
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: t('expenses', 'Витрати'),
            headerTitle: t('expenses', 'Витрати'),
            href: '/expenses',
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: t('analytics', 'Аналітика'),
            headerTitle: t('analytics', 'Аналітика'),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профіль',
            headerTitle: 'Профіль',
          }}
        />
      </Tabs>
      
      {/* Додаємо наш власний TabBar */}
      <CustomTabBar />
    </View>
  );
}
