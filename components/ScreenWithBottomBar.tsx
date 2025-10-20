import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';

interface ScreenWithBottomBarProps {
  children: ReactNode;
  scrollable?: boolean;
}

/**
 * Компонент-обгортка, який додає відступ знизу для екранів з нижнім меню
 */
export default function ScreenWithBottomBar({ children, scrollable = true }: ScreenWithBottomBarProps) {
  // Висота нижнього меню залежить від платформи
  const bottomBarHeight = Platform.OS === 'ios' ? 90 : 70;
  
  // Якщо потрібен скролінг, використовуємо ScrollView
  if (scrollable) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: bottomBarHeight }}
      >
        {children}
      </ScrollView>
    );
  }
  
  // Якщо скролінг не потрібен, використовуємо звичайний View
  return (
    <View style={[styles.container, { paddingBottom: bottomBarHeight }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
