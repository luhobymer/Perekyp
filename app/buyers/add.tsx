import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
import AnimatedScreen from '../../src/components/AnimatedScreen';

export default function AddBuyerScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert(t('errors.title'), t('buyers.errors.nameRequired', 'Ім\'я обов\'язкове'));
      return false;
    }
    if (!phone.trim()) {
      Alert.alert(t('errors.title'), t('buyers.errors.phoneRequired', 'Телефон обов\'язковий'));
      return false;
    }
    if (email && !email.includes('@')) {
      Alert.alert(t('errors.title'), t('buyers.errors.invalidEmail', 'Некоректний email'));
      return false;
    }
    return true;
  };

  const handleAddBuyer = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Тут буде логіка додавання покупця до бази даних
      // await addBuyer({ name, phone, email, address, notes });
      
      // Імітація затримки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        t('success.title', 'Успіх'),
        t('buyers.success.added', 'Покупця успішно додано'),
        [{ text: t('common.ok', 'OK'), onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Помилка додавання покупця:', error);
      Alert.alert(t('errors.title', 'Помилка'), t('buyers.errors.adding', 'Помилка додавання покупця'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <Stack.Screen
        options={{
          title: t('buyers.addTitle', 'Додати покупця'),
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{t('buyers.personalInfo', 'Особиста інформація')}</Text>
          
          <Text style={styles.inputLabel}>{t('buyers.name', 'Ім\'я та прізвище')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('buyers.namePlaceholder', 'Введіть ім\'я та прізвище')}
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.inputLabel}>{t('buyers.phone', 'Телефон')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('buyers.phonePlaceholder', 'Введіть номер телефону')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          <Text style={styles.inputLabel}>{t('buyers.email', 'Email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('buyers.emailPlaceholder', 'Введіть email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.sectionTitle}>{t('buyers.additionalInfo', 'Додаткова інформація')}</Text>
          
          <Text style={styles.inputLabel}>{t('buyers.address', 'Адреса')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('buyers.addressPlaceholder', 'Введіть адресу')}
            value={address}
            onChangeText={setAddress}
          />
          
          <Text style={styles.inputLabel}>{t('buyers.notes', 'Примітки')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('buyers.notesPlaceholder', 'Введіть примітки')}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleAddBuyer}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('common.loading', 'Завантаження...') : t('buyers.addButton', 'Додати покупця')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primary,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#212529',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
