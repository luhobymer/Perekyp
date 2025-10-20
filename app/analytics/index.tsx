import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnalyticsScreen from '../../src/screens/analytics/AnalyticsScreen';
import SafeAreaView from '../../components/SafeAreaView';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import UniversalFAB from '../../src/components/UniversalFAB';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';

export default function AnalyticsIndex() {
  const params = useLocalSearchParams();
  const { tab } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <AnimatedScreen transition="slideRight" duration={400}>
          <AnalyticsScreen initialTab={tab as string || 'expenses'} />
        </AnimatedScreen>
      </SafeAreaView>
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