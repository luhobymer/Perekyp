import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { SelectProps } from '../types/components/select';

/**
 * Компонент для вибору значення зі списку
 */
function Select<T>({ 
  label, 
  value, 
  onValueChange, 
  items, 
  placeholder, 
  disabled = false,
  itemLabelGetter = null 
}: SelectProps<T>): JSX.Element {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  /**
   * Обробник вибору елемента
   */
  const handleSelect = (item: T): void => {
    onValueChange(item);
    setModalVisible(false);
  };

  /**
   * Функція для отримання відображуваного значення
   */
  const getDisplayValue = (val: T | null): string => {
    if (!val) return placeholder || 'Виберіть значення';
    return itemLabelGetter ? itemLabelGetter(val) : String(val);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.select,
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            opacity: disabled ? 0.5 : 1
          }
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[styles.value, { color: value ? theme.colors.text : theme.colors.textSecondary }]}>
          {getDisplayValue(value)}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {label || 'Виберіть значення'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    { 
                      backgroundColor: value === item ? theme.colors.primary : 'transparent',
                      borderBottomColor: theme.colors.border
                    }
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { color: value === item ? '#FFFFFF' : theme.colors.text }
                    ]}
                  >
                    {itemLabelGetter ? itemLabelGetter(item) : String(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  value: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Select;
