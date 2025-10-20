import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { COLORS } from '../constants/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GlobalBottomBar from '../components/GlobalBottomBar';
import { MainStackParamList } from '../types/navigation/mainNavigator';

// Імпорт навігаторів та екранів
import CarsNavigator from './CarsNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CleanScreen from '../screens/clean/CleanScreen';

// Створення стек-навігатора для основних екранів
const Stack = createNativeStackNavigator<MainStackParamList>();

// Типи для навігації
type MainNavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

// Максимально простий компонент FAB
const SuperSimpleFAB: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp>();
  
  const handlePress = (): void => {
    try {
      console.log('Navigating to AddCar');
      navigation.navigate('CarsTab', { screen: 'AddCar' });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  return (
    <TouchableOpacity 
      style={{
        position: 'absolute',
        right: 20,
        bottom: Platform.OS === 'ios' ? 140 : 130,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
      }}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={{
        color: '#FFFFFF',
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: -5,
      }}>+</Text>
    </TouchableOpacity>
  );
};

/**
 * Головний навігатор додатку, який містить основні екрани
 */
const MainNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="CarsTab"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="CarsTab" component={CarsNavigator} options={{ title: t('cars', 'Авто') }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings', 'Налаштування') }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: t('analytics', 'Аналітика') }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile', 'Профіль') }} />
        <Stack.Screen name="Clean" component={CleanScreen} options={{ title: t('clean', 'Очистити') }} />
      </Stack.Navigator>
      <SuperSimpleFAB />
      <GlobalBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default MainNavigator;
