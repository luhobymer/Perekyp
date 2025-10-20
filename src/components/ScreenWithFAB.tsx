import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import NewFAB from './NewFAB';
import { ScreenWithFABProps } from '../types/components/fab';

/**
 * Обгортка для екранів з FAB. Розміщує FAB над нижнім меню, приймає масив дій для плюсика.
 */
const ScreenWithFAB: React.FC<ScreenWithFABProps> = ({ 
  children, 
  fabActions = [], 
  navigation 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {fabActions.length > 0 && (
        <NewFAB 
          actions={fabActions}
          navigation={navigation}
          style={styles.fabContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 120 : Platform.OS === 'android' ? 110 : 100,
    zIndex: 9999,
    elevation: 10,
  },
});

export default ScreenWithFAB;
