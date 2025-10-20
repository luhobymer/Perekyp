import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  StatusBar 
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import { SIZES, FONTS } from '../../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width, height } = Dimensions.get('window');

interface AuthWelcomeScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
}

/**
 * Екран привітання для неавторизованих користувачів
 */
const AuthWelcomeScreen: React.FC<AuthWelcomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: theme.colors.background }
    ]}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />

      <View style={styles.logoContainer}>
        <Text style={[
          styles.appName, 
          { color: theme.colors.primary }
        ]}>
          {t('app_name')}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[
          styles.welcomeText, 
          { color: theme.colors.text }
        ]}>
          {t('welcome')}
        </Text>
        
        <Text style={[
          styles.description, 
          { color: theme.colors.textSecondary }
        ]}>
          {t('app_description', {
            defaultValue: 'Додаток для контролю купівлі, вкладень і продажу або розбору авто'
          })}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title={t('login')}
          onPress={() => navigation.navigate('Login')}
          type="primary"
          style={styles.button}
        />
        
        <Button
          title={t('register')}
          onPress={() => navigation.navigate('Register')}
          type="outline"
          style={styles.button}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[
          styles.footerText, 
          { color: theme.colors.textSecondary }
        ]}>
          {t('help_contact', {
            defaultValue: 'Допомога та підтримка'
          })}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  logoContainer: {
    marginBottom: height * 0.05,
    alignItems: 'center',
  },
  appName: {
    fontSize: FONTS.sizes.header,
    fontWeight: FONTS.weights.bold,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  welcomeText: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
    marginBottom: SIZES.medium,
  },
  description: {
    fontSize: FONTS.sizes.medium,
    textAlign: 'center',
    lineHeight: FONTS.sizes.medium * 1.5,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: height * 0.05,
  },
  button: {
    marginBottom: SIZES.medium,
  },
  footer: {
    position: 'absolute',
    bottom: SIZES.large,
  },
  footerText: {
    fontSize: FONTS.sizes.small,
  },
});

export default AuthWelcomeScreen;
