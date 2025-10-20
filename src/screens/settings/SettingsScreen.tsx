import React, { useCallback, useEffect } from 'react';
// Додаємо типи для DOM елементів
declare global {
  interface Window {
    localStorage: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
    };
    location: {
      reload: () => void;
    };
  }
  var window: Window;
  var document: {
    documentElement: {
      lang: string;
      setAttribute: (name: string, value: string) => void;
    };
  };
}
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTranslationWithForce } from '../../hooks/useTranslationWithForce';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { I18nManager } from 'react-native';
import { AppLanguage, SettingsScreenProps } from '../../types/screens/settings';

// Розширюємо тип AppLanguage для підтримки арабської мови (для RTL перевірки)

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { t, i18n } = useTranslationWithForce();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  // Перевіряємо початкову мову
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = window.localStorage.getItem('language');
      console.log(`[SettingsScreen] Початкова мова з localStorage: ${savedLang}, поточна мова i18n: ${i18n.language}`);
      
      // Якщо є збережена мова але вона не відповідає поточній, примусово перемикаємо
      if (savedLang && savedLang !== i18n.language) {
        console.log(`[SettingsScreen] Примусово встановлюємо мову: ${savedLang}`);
        i18n.changeLanguage(savedLang);
        
        // Локалізуємо DOM для веб-версії
        if (document) {
          document.documentElement.lang = savedLang;
          document.documentElement.setAttribute('lang', savedLang);
        }
      }
    }
  }, []);
  
  // Змінити мову
  const handleLanguageChange = useCallback((lng: AppLanguage | 'ar') => {
    // Запобігаємо зайвим діям
    if (i18n.language === lng) {
      Alert.alert(
        'Інформація',
        'Ця мова вже встановлена',
        [{ text: 'OK' }]
      );
      return;
    }
    
    console.log(`[SettingsScreen] Зміна мови на: ${lng}`);
    
    // 1. Зберігаємо в localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', lng);
      console.log('[SettingsScreen] Мова збережена в localStorage');
      
      // Одразу перевіряємо, що зберіглось
      const savedLang = window.localStorage.getItem('language');
      console.log(`[SettingsScreen] Перевірка збереження: ${savedLang}`);
      
      // 4. Локалізуємо DOM для веб-версії
      if (document) {
        document.documentElement.lang = lng;
        document.documentElement.setAttribute('lang', lng);
      }
    }
    
    // 2. Змінюємо напрям тексту для RTL мов
    I18nManager.forceRTL(lng === 'ar' as string);
    
    // 3. Примусово встановлюємо мову через i18n
    i18n.changeLanguage(lng);
    i18n.options.lng = lng;
    
    // 5. Повідомляємо про успіх
    Alert.alert(
      'Готово',
      'Мову змінено. Перезавантажте додаток для повного застосування змін.',
      [
        { 
          text: 'Перезавантажити', 
          onPress: () => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }
        }
      ]
    );
  }, [i18n]);
  
  // Визначення активної мови
  const isUkrainian = i18n.language === 'uk';
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t('settings')}
        </Text>
      </View>
      
      <ScrollView>
        {/* Додаємо поточну мову для діагностики */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Діагностика
          </Text>
          
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              Поточна мова:
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
              {i18n.language}
            </Text>
          </View>
        </View>
        
        {/* Налаштування зовнішнього вигляду */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('appearance')}
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('dark_mode')}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
        
        {/* Налаштування мови */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('language')}
          </Text>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity 
              style={[
                styles.languageOption, 
                isUkrainian && { 
                  backgroundColor: theme.colors.primaryLight + '20',
                  borderColor: theme.colors.primary,
                },
                { borderColor: isUkrainian ? theme.colors.primary : theme.colors.border }
              ]}
              onPress={() => handleLanguageChange('uk')}
            >
              <Text style={[
                styles.languageOptionText, 
                { 
                  color: isUkrainian ? theme.colors.primary : theme.colors.text,
                  fontWeight: isUkrainian ? FONTS.weights.bold as any : FONTS.weights.regular as any,
                }
              ]}>
                Українська
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.languageOption, 
                !isUkrainian && { 
                  backgroundColor: theme.colors.primaryLight + '20',
                  borderColor: theme.colors.primary,
                },
                { borderColor: !isUkrainian ? theme.colors.primary : theme.colors.border }
              ]}
              onPress={() => handleLanguageChange('ru')}
            >
              <Text style={[
                styles.languageOptionText, 
                { 
                  color: !isUkrainian ? theme.colors.primary : theme.colors.text,
                  fontWeight: !isUkrainian ? FONTS.weights.bold as any : FONTS.weights.regular as any,
                }
              ]}>
                Русский
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Інформація про додаток */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('about_app')}
          </Text>
          
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              {t('version')}:
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
              1.0.0
            </Text>
          </View>
          
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              {t('developer')}:
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
              PerekypApp Team
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold as any,
  },
  section: {
    margin: SIZES.medium,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold as any,
    marginBottom: SIZES.medium,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FONTS.sizes.medium,
    marginLeft: SIZES.medium,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageOption: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: SIZES.xsmall,
  },
  languageOptionText: {
    fontSize: FONTS.sizes.medium,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  aboutLabel: {
    fontSize: FONTS.sizes.medium,
  },
  aboutValue: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.semiBold as any,
  },
});

export default SettingsScreen;
