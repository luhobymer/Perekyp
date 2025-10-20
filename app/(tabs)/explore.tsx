import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AnalyticsScreen from '../../src/screens/analytics/AnalyticsScreen';
import AnimatedScreen from '../../components/AnimatedScreen';

export default function ExploreScreen() {
  const { tab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('expenses');
  
  useEffect(() => {
    if (tab && typeof tab === 'string') {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <AnimatedScreen transition="slideRight" duration={400}>
      <AnalyticsScreen initialTab={activeTab} />
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({});
