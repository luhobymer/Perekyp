import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarScreen } from '../../src/screens/calendar/CalendarScreen';
import { useTheme } from '../../src/hooks/useTheme';

export default function CalendarTab() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CalendarScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 