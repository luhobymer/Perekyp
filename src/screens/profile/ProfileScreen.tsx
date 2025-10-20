import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslationWithForce } from '../../hooks/useTranslationWithForce';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { supabase } from '../../services/supabase';
import { clear } from '../../utils/storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../../constants/theme';
import { changeLanguage } from '../../utils/i18n';
import { UserProfile, ProfileFormData, ProfileScreenProps } from '../../types/screens/profile';

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { t, i18n } = useTranslationWithForce();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user && user.id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async (): Promise<void> => {
    if (!user || !user.id) {
      console.log('Користувач не увійшов або ID відсутній');
      setLoading(false);
      return;
    }
  
    try {
      console.log('Завантаження профілю для користувача ID:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Помилка запиту профілю:', error);
        // Якщо профілю немає, створюємо новий
        if (error.code === 'PGRST116') {
          console.log('Профіль не знайдено, створюємо новий');
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              email: user.email
            });
            
          if (createError) {
            console.error('Помилка створення профілю:', createError);
            throw createError;
          }
          
          // Повторно завантажуємо профіль
          const { data: newData, error: refetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (refetchError) throw refetchError;
          
          if (newData) {
            setProfile(newData as UserProfile);
            setFormData({
              full_name: newData.full_name || '',
              phone: newData.phone || '',
              address: newData.address || '',
            });
          }
        } else {
          throw error;
        }
      } else if (data) {
        setProfile(data as UserProfile);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleClearCache = useCallback((): void => {
    Alert.alert(
      t('clear_cache_title'),
      t('clear_cache_confirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await clear();
              Alert.alert(t('success'), t('cache_cleared'));
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert(t('error'), t('error_clearing_cache'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [t]);

  const handleLanguageChange = useCallback((language: string): void => {
    changeLanguage(language);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text }}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Animated.View entering={FadeInUp.duration(500)}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={[styles.email, { color: theme.colors.text }]}>
            {user?.email}
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <View style={[styles.section, { backgroundColor: theme.colors.card, margin: 16, borderRadius: 8, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('personal_info')}
          </Text>
          
          {editing ? (
            <>
              <Input
                label={t('full_name')}
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                placeholder={t('enter_full_name')}
                containerStyle={{ marginBottom: 10 }}
              />
              
              <Input
                label={t('phone')}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder={t('enter_phone')}
                keyboardType="phone-pad"
                containerStyle={{ marginBottom: 10 }}
              />
              
              <Input
                label={t('address')}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder={t('enter_address')}
                containerStyle={{ marginBottom: 10 }}
              />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('full_name')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile?.full_name || t('not_specified')}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('phone')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile?.phone || t('not_specified')}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('address')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile?.address || t('not_specified')}</Text>
              </View>
            </>
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)}>
        <View style={[styles.section, { backgroundColor: theme.colors.card, margin: 16, borderRadius: 8, padding: 16 }]}>
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
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language-outline" size={24} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {t('language')}
              </Text>
            </View>
          </View>
          
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  borderColor: i18n.language === 'uk' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: i18n.language === 'uk' ? `${theme.colors.primary}20` : 'transparent'
                }
              ]}
              onPress={() => handleLanguageChange('uk')}
            >
              <Text style={[
                styles.languageOptionText, 
                { 
                  color: i18n.language === 'uk' ? theme.colors.primary : theme.colors.text,
                  fontWeight: i18n.language === 'uk' ? 'bold' : 'normal'
                }
              ]}>
                Українська
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  borderColor: i18n.language === 'ru' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: i18n.language === 'ru' ? `${theme.colors.primary}20` : 'transparent'
                }
              ]}
              onPress={() => handleLanguageChange('ru')}
            >
              <Text style={[
                styles.languageOptionText, 
                { 
                  color: i18n.language === 'ru' ? theme.colors.primary : theme.colors.text,
                  fontWeight: i18n.language === 'ru' ? 'bold' : 'normal'
                }
              ]}>
                Русский
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <View style={[styles.section, { backgroundColor: theme.colors.card, margin: 16, borderRadius: 8, padding: 16 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('clean_title')}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {t('clean_description')}
          </Text>
          
          <Button
            title={t('clear_cache')}
            onPress={handleClearCache}
            type="danger"
            style={styles.button}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(500)}>
        <View style={[styles.section, { backgroundColor: theme.colors.card, margin: 16, borderRadius: 8, padding: 16 }]}>
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
      </Animated.View>

      <View style={styles.buttonsContainer}>
        {editing ? (
          <>
            <Button
              title={t('save')}
              onPress={handleUpdateProfile}
              style={styles.button}
            />
            <Button
              title={t('cancel')}
              onPress={() => setEditing(false)}
              type="outline"
              style={styles.button}
            />
          </>
        ) : (
          <>
            <Button
              title={t('edit_profile')}
              onPress={() => setEditing(true)}
              style={styles.button}
            />
            <Button
              title={t('sign_out')}
              onPress={signOut}
              type="danger"
              style={styles.button}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  buttonsContainer: {
    padding: 20,
  },
  button: {
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  languageOptionText: {
    fontSize: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
