import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
// @ts-ignore - Ігноруємо помилку відсутності типів для react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native';
// Імпортуємо типи для використання в документації
// import { CleanOption } from '../../types/screens/clean';

/**
 * Екран для очищення даних та кешу додатку
 */
const CleanScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [clearingCache, setClearingCache] = useState<boolean>(false);
  const [clearingData, setClearingData] = useState<boolean>(false);
  const [syncingData, setSyncingData] = useState<boolean>(false);

  /**
   * Обробник очищення кешу
   */
  const handleClearCache = (): void => {
    Alert.alert(
      t('clear_cache_title'),
      t('clear_cache_confirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('clear'),
          onPress: async () => {
            setClearingCache(true);
            try {
              // Імітуємо процес очищення кешу
              await new Promise(resolve => setTimeout(resolve, 1500));
              Alert.alert(t('success.title'), t('cache_cleared'));
            } catch (error) {
              console.error('Помилка при очищенні кешу:', error);
              Alert.alert(t('errors.title'), t('cache_clear_failed'));
            } finally {
              setClearingCache(false);
            }
          }
        }
      ]
    );
  };

  /**
   * Обробник очищення даних
   */
  const handleClearData = (): void => {
    Alert.alert(
      t('clear_data_title'),
      t('clear_data_confirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: async () => {
            setClearingData(true);
            try {
              // Імітуємо процес очищення даних
              await new Promise(resolve => setTimeout(resolve, 2000));
              Alert.alert(t('success.title'), t('data_cleared'));
            } catch (error) {
              console.error('Помилка при очищенні даних:', error);
              Alert.alert(t('errors.title'), t('data_clear_failed'));
            } finally {
              setClearingData(false);
            }
          }
        }
      ]
    );
  };

  /**
   * Обробник синхронізації даних
   */
  const handleSyncData = async (): Promise<void> => {
    setSyncingData(true);
    try {
      // Імітуємо процес синхронізації
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(t('success.title'), t('offline_sync_success'));
    } catch (error) {
      console.error('Помилка при синхронізації даних:', error);
      Alert.alert(t('errors.title'), t('offline_sync_error'));
    } finally {
      setSyncingData(false);
    }
  };

  /**
   * Рендер опції очищення
   */
  const renderCleanOption = (
    title: string, 
    description: string, 
    onPress: () => void, 
    isLoading: boolean, 
    iconName: string
  ): JSX.Element => {
    return (
      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]} 
        onPress={onPress}
        disabled={isLoading}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionLeft}>
            <Icon name={iconName} size={24} color={theme.colors.primary} />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{title}</Text>
              <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>{description}</Text>
            </View>
          </View>
          <View style={styles.optionRight}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.animatedContainer}>
        <ScrollView>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t('clean_title')}
            </Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {t('clean_description')}
            </Text>
            
            <View style={styles.optionsContainer}>
              {renderCleanOption(
                t('clear_cache'),
                t('clear_cache_description') || t('clear_cache_confirm'),
                handleClearCache,
                clearingCache,
                'cached'
              )}
              
              {renderCleanOption(
                t('clear_data'),
                t('clear_data_description') || t('clear_data_confirm'),
                handleClearData,
                clearingData,
                'delete-sweep'
              )}
              
              {renderCleanOption(
                t('sync_now'),
                t('sync_data_description') || t('offline_changes_pending'),
                handleSyncData,
                syncingData,
                'sync'
              )}

              {Platform.OS === 'web' && (
                <View style={[styles.webNoticeContainer, { backgroundColor: theme.colors.notification }]}>
                  <Icon name="information" size={20} color={theme.colors.text} />
                  <Text style={[styles.webNotice, { color: theme.colors.text }]}>
                    {t('web_version_limitation')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  optionRight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  webNoticeContainer: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  webNotice: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  }
});

export default CleanScreen;
