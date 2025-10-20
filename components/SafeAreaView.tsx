import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { useSegments } from 'expo-router';

interface SafeAreaViewProps {
  children: ReactNode;
}

/**
 * Компонент, який забезпечує правильні відступи для контенту від нижнього меню
 */
export default function SafeAreaView({ children }: SafeAreaViewProps) {
  const { user } = useAuth();
  const segments = useSegments();
  const isInAuthGroup = segments[0] === '(auth)';
  const showBottomBar = user && !isInAuthGroup;

  return (
    <View style={[
      styles.container,
      showBottomBar && styles.withBottomBar
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as const,
  withBottomBar: {
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  } as const,
});
