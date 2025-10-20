import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ErrorMessageProps } from '../types/components/errorMessage';

/**
 * Компонент для відображення повідомлення про помилку
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Ionicons 
        name="alert-circle-outline" 
        size={64} 
        color={theme.colors.error} 
      />
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message || 'Виникла помилка. Спробуйте ще раз.'}
      </Text>
      
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} 
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: '#FFFFFF' }]}>
            Спробувати знову
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '500' as any,
  },
});

export default ErrorMessage;
