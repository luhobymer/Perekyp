import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Platform,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { FABAction } from '../types/components/fab';

/**
 * Глобальна кнопка швидких дій
 */
const GlobalFAB: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Конфігурація кнопок швидких дій
  const actions: FABAction[] = [
    {
      title: t('add_car', 'Додати авто'),
      icon: 'car-outline',
      iconBg: COLORS.primary,
      onPress: () => {
        console.log('Navigating to AddCar');
        try {
          navigation.navigate('CarsTab', { screen: 'AddCar' });
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert('Помилка навігації', (error as Error).message);
        }
      },
    },
    {
      title: t('add_expense', 'Додати витрату'),
      icon: 'cash-outline',
      iconBg: COLORS.success,
      onPress: () => {
        console.log('Navigating to AddExpense');
        try {
          navigation.navigate('CarsTab', { screen: 'AddExpense' });
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert('Помилка навігації', (error as Error).message);
        }
      },
    },
    {
      title: t('update_mileage', 'Оновити пробіг'),
      icon: 'speedometer-outline',
      iconBg: COLORS.info,
      onPress: () => Alert.alert(t('feature_in_progress', 'Функція в розробці')),
    },
    {
      title: t('add_document', 'Додати документ'),
      icon: 'document-text-outline',
      iconBg: COLORS.warning,
      onPress: () => Alert.alert(t('feature_in_progress', 'Функція в розробці')),
    },
    {
      title: t('add_buyer', 'Додати покупця'),
      icon: 'person-add-outline',
      iconBg: COLORS.secondary,
      onPress: () => Alert.alert(t('feature_in_progress', 'Функція в розробці')),
    },
    {
      title: t('search', 'Пошук'),
      icon: 'search-outline',
      iconBg: COLORS.primary,
      onPress: () => Alert.alert(t('feature_in_progress', 'Функція в розробці')),
    },
  ];

  /**
   * Перемикання стану меню (відкрито/закрито)
   */
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * Обробник натискання на дію
   */
  const handleActionPress = (action: FABAction): void => {
    toggleMenu();
    setTimeout(() => {
      if (action.onPress) {
        action.onPress(navigation);
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {isOpen && (
        <View style={styles.menuContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionButton, { backgroundColor: action.iconBg || COLORS.primary }]}
              onPress={() => handleActionPress(action)}
            >
              <View style={styles.actionContent}>
                <Ionicons
                  name={action.icon}
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.actionText}>
                  {action.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isOpen ? "close" : "add"} 
          size={32} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 140 : Platform.OS === 'android' ? 130 : 120,
    zIndex: 9999,
    elevation: 10,
    width: 60,
    height: 60,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9998,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: 'transparent',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default GlobalFAB;
