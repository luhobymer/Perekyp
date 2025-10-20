import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native';
import { AnimatedScreen } from '../../src/components/AnimatedScreen';
import { useTranslationWithForce } from '../../src/hooks/useTranslationWithForce';
import { useTheme } from '../../src/hooks/useTheme';
import i18n from '../../src/utils/i18n';

const LanguageScreen = () => {
  const { t, currentLanguage } = useTranslationWithForce();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Доступні мови
  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  // Обробник зміни мови
  const handleLanguageChange = async (languageCode: string) => {
    if (currentLanguage === languageCode) return;
    
    try {
      setLoading(true);
      await i18n.changeLanguage(languageCode);
      
      // Зачекати завантаження нової мови
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('[LanguageScreen] Error changing language:', error);
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('select_language', 'Оберіть мову')}
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              {t('changing_language', 'Змінюємо мову...')}
            </Text>
          </View>
        ) : (
          <View style={styles.languagesList}>
            {languages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: currentLanguage === language.code 
                      ? theme.colors.primary 
                      : theme.colors.border
                  }
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.flag}>{language.flag}</Text>
                <Text style={[styles.languageName, { color: theme.colors.text }]}>
                  {language.name}
                </Text>
                {currentLanguage === language.code && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={[styles.note, { color: theme.colors.text }]}>
          {t('language_note', 'Після зміни мови додаток автоматично перезавантажиться')}
        </Text>
      </ScrollView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  languagesList: {
    width: '100%',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 18,
    flex: 1,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  }
});

export default LanguageScreen; 