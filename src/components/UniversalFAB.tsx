import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  TouchableWithoutFeedback,
  Alert,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/theme';
import { FABAction } from '../types/components/fab';

interface UniversalFABProps {
  router: {
    push: (path: string | { pathname: string; params: Record<string, any> }) => void;
    pathname?: string;
  };
  style?: ViewStyle;
}

/**
 * Універсальний FAB компонент з однаковими діями для всіх екранів
 */
const UniversalFAB: React.FC<UniversalFABProps> = ({ router, style }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Універсальний набір дій для всіх екранів
  const actions: FABAction[] = [
    {
      title: t('add_car', 'Додати авто'),
      icon: 'car-outline',
      iconBg: COLORS.primary,
      onPress: () => {
        try {
          router.push('/cars/add');
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
        try {
          // Перевіряємо, чи в поточному URL є параметр carId
          const currentUrl = router.pathname || '';
          const match = currentUrl.match(/\/cars\/(\d+)/);
          const carId = match ? match[1] : null;
          
          // Якщо є carId, передаємо його як параметр, інакше переходимо без параметрів
          if (carId) {
            router.push({
              pathname: '/expenses/add',
              params: { carId }
            });
          } else {
            router.push('/expenses/add');
          }
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
      onPress: () => {
        try {
          router.push('/cars/mileage');
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert('Помилка навігації', (error as Error).message);
        }
      },
    },
    {
      title: t('add_document', 'Додати документ'),
      icon: 'document-text-outline',
      iconBg: COLORS.warning,
      onPress: () => {
        try {
          router.push('/documents/add');
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert(t('feature_coming_soon', 'Функція в розробці'));
        }
      },
    },
    {
      title: t('add_buyer', 'Додати покупця'),
      icon: 'person-add-outline',
      iconBg: COLORS.secondary,
      onPress: () => {
        try {
          router.push('/buyers/add');
        } catch (error) {
          console.error('Navigation error:', error);
          Alert.alert('Помилка навігації', (error as Error).message);
        }
      },
    }
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
        action.onPress();
      }
    }, 300);
  };

  return (
    <View style={[styles.container, style]}>
      {isOpen && (
        <View style={styles.fabMenuContainer}>
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          
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
  fabMenuContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    zIndex: 9998,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: 0,
    bottom: 0,
    width: 2000,
    height: 2000,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9000,
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
    zIndex: 10000,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10000,
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
    minWidth: 200,
    zIndex: 10001,
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

export default UniversalFAB;
