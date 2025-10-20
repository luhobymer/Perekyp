import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { NewFABProps, FABAction } from '../types/components/fab';

/**
 * Компонент кнопки швидких дій (FAB)
 */
const NewFAB: React.FC<NewFABProps> = ({ actions = [], navigation, style }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Відкриття/закриття меню
   */
  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * Обробка натискання на дію
   * @param action - об'єкт дії
   */
  const handleActionPress = (action: FABAction): void => {
    toggleMenu();
    if (action.onPress) {
      action.onPress(navigation);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isOpen && (
        <View style={styles.menuContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                { backgroundColor: action.iconBg || COLORS.primary }
              ]}
              onPress={() => handleActionPress(action)}
            >
              <View style={styles.actionContent}>
                <Ionicons
                  name={action.icon as any}
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
        <Ionicons name="add" size={32} color="#FFFFFF" />
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
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
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

export default NewFAB;
