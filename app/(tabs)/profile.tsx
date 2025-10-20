import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';
import { useTheme } from '../../src/hooks/useTheme';
import AnimatedScreen from '../../components/AnimatedScreen';
import UniversalFAB from '../../src/components/UniversalFAB';
import { useRouter } from 'expo-router';

export default function ProfileTab() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedScreen transition="slideRight" duration={400}>
        <ProfileScreen />
      </AnimatedScreen>
      <UniversalFAB router={router} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
}); 