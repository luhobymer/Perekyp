import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Modal,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { FABAction } from '../types/components/fab';

/**
 * Простий компонент FAB з модальним меню
 */
const SimpleFAB: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Конфігурація кнопок швидких дій
  const actions: FABAction[] = [
    {
      title: t('add_car', 'Додати авто'),
      icon: 'car-outline',
      color: '#3498db',
      onPress: () => {
        console.log('Додати авто');
        try {
          navigation.navigate('CarsTab', { screen: 'AddCar' });
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert('Помилка навігації', (error as Error).message);
        }
      }
    },
    {
      title: t('add_expense', 'Додати витрату'),
      icon: 'cash-outline',
      color: '#2ecc71',
      onPress: () => {
        console.log('Додати витрату');
        Alert.alert('Додати витрату', 'Ця функція буде реалізована пізніше');
      }
    },
    {
      title: t('update_mileage', 'Оновити пробіг'),
      icon: 'speedometer-outline',
      color: '#f39c12',
      onPress: () => {
        console.log('Оновити пробіг');
        Alert.alert('Оновити пробіг', 'Ця функція буде реалізована пізніше');
      }
    },
    {
      title: t('add_document', 'Додати документ'),
      icon: 'document-text-outline',
      color: '#e74c3c',
      onPress: () => {
        console.log('Додати документ');
        Alert.alert('Додати документ', 'Ця функція буде реалізована пізніше');
      }
    },
    {
      title: t('add_buyer', 'Додати покупця'),
      icon: 'person-add-outline',
      color: '#9b59b6',
      onPress: () => {
        console.log('Додати покупця');
        Alert.alert('Додати покупця', 'Ця функція буде реалізована пізніше');
      }
    },
    {
      title: t('search', 'Пошук'),
      icon: 'search-outline',
      color: '#34495e',
      onPress: () => {
        console.log('Пошук');
        Alert.alert('Пошук', 'Ця функція буде реалізована пізніше');
      }
    }
  ];

  /**
   * Перемикання стану меню (відкрито/закрито)
   */
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      {/* Модальне вікно для меню */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        >
          <View style={styles.menuContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: action.color }]}
                onPress={() => {
                  toggleMenu();
                  setTimeout(() => {
                    if (action.onPress) {
                      action.onPress(navigation);
                    }
                  }, 300);
                }}
              >
                <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                <Text style={styles.menuItemText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Кнопка FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleMenu}
      >
        <Ionicons name={isOpen ? "close" : "add"} size={30} color="#FFFFFF" />
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
  },
  fab: {
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
    zIndex: 9999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    maxHeight: '80%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  menuItemText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default SimpleFAB;
