import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface SafeAreaForBottomBarProps {
  children: ReactNode;
}

/**
 * Компонент, який додає безпечну зону для контенту, щоб він не перекривався нижнім меню
 */
export default function SafeAreaForBottomBar({ children }: SafeAreaForBottomBarProps) {
  return (
    <View style={styles.container}>
      {children}
      {/* Додатковий відступ внизу, щоб контент не перекривався нижнім меню */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 90 : 70,
  },
});
