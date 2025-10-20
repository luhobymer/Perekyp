import React from 'react';
import { StyleSheet, View } from 'react-native';
import CarExpensesScreen from '../../src/screens/expenses/CarExpensesScreen';
import SafeAreaView from '../../components/SafeAreaView';
import AnimatedScreen from '../../components/AnimatedScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import UniversalFAB from '../../src/components/UniversalFAB';

export default function ExpensesIndex() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <AnimatedScreen transition="slideRight" duration={400}>
          <CarExpensesScreen 
            route={{ params }} 
            navigation={null} 
          />
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