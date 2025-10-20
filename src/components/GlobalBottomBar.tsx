import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { useNavigation, useRoute, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { BottomTab } from '../types/components/globalBottomBar';

/**
 * Пропси для компонента GlobalBottomBar
 */
interface GlobalBottomBarProps {
  /** Додаткові стилі для контейнера */
  containerStyle?: StyleProp<ViewStyle>;
  /** Колір активної вкладки */
  activeColor?: string;
  /** Колір неактивної вкладки */
  inactiveColor?: string;
}

const GlobalBottomBar: React.FC<GlobalBottomBarProps> = ({
  containerStyle,
  activeColor = COLORS.primary,
  inactiveColor = '#8E8E93'
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute();
  
  // Визначаємо поточний активний екран
  const isActive = (screenName: string): boolean => {
    const currentRoute = route.name;
    
    if (screenName === 'Home' && (currentRoute === 'Home' || currentRoute === 'Main')) return true;
    if (screenName === 'Cars' && (currentRoute.includes('Cars') || currentRoute.includes('Car'))) return true;
    if (screenName === 'Expenses' && currentRoute.includes('Expense')) return true;
    if (screenName === 'Analytics' && currentRoute.includes('Analytics')) return true;
    if (screenName === 'Profile' && currentRoute.includes('Profile')) return true;
    
    return false;
  };
  
  // Функція для навігації
  const navigateTo = (screenName: string): void => {
    try {
      switch (screenName) {
        case 'Home':
          navigation.navigate('Home');
          break;
        case 'Cars':
          navigation.navigate('CarsTab');
          break;
        case 'Expenses':
          navigation.navigate('ExpensesTab');
          break;
        case 'Analytics':
          navigation.navigate('Analytics');
          break;
        case 'Profile':
          navigation.navigate('Profile');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  // Визначаємо пункти меню
  const tabs: BottomTab[] = [
    {
      name: 'Home',
      label: 'Головна',
      icon: 'home',
      iconActive: 'home',
      iconInactive: 'home-outline',
    },
    {
      name: 'Cars',
      label: 'Авто',
      icon: 'car',
      iconActive: 'car',
      iconInactive: 'car-outline',
    },
    {
      name: 'Expenses',
      label: 'Витрати',
      icon: 'cash',
      iconActive: 'cash',
      iconInactive: 'cash-outline',
    },
    {
      name: 'Analytics',
      label: 'Аналітика',
      icon: 'stats-chart',
      iconActive: 'stats-chart',
      iconInactive: 'stats-chart-outline',
    },
    {
      name: 'Profile',
      label: 'Профіль',
      icon: 'person-circle',
      iconActive: 'person-circle',
      iconInactive: 'person-circle-outline',
    },
  ];
  
  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => navigateTo(tab.name)}
          activeOpacity={0.7}
        >
          <Ionicons
            size={24}
            name={isActive(tab.name) ? tab.iconActive : tab.iconInactive as any}
            color={isActive(tab.name) ? activeColor : inactiveColor}
          />
          <Text
            style={[
              styles.label,
              { color: isActive(tab.name) ? activeColor : inactiveColor },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default GlobalBottomBar;
