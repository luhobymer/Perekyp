import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import SafeAreaView from '../../components/SafeAreaView';
import { useTranslation } from 'react-i18next';
import CarsListScreen from '../../src/screens/cars/CarsListScreen';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useTheme } from '../../src/hooks/useTheme';
import UniversalFAB from '../../src/components/UniversalFAB';

export default function CarsIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('my_cars', 'Мої автомобілі'),
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <View style={styles.container}>
        <SafeAreaView>
          <AnimatedScreen transition="slideRight" duration={400}>
            <CarsListScreen />
          </AnimatedScreen>
        </SafeAreaView>
        <UniversalFAB router={router} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
}); 