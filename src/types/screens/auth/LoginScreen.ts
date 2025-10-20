import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Пропси для екрану входу
 */
export interface LoginScreenProps {
  /**
   * Обробник входу через Google
   */
  onGoogleSignIn: () => Promise<void>;
  
  /**
   * Стан завантаження
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Повідомлення про помилку
   */
  error?: string | null;
  
  /**
   * Додаткові стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для контенту
   */
  contentStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для логотипу
   */
  logoStyle?: StyleProp<ImageStyle>;
  
  /**
   * Додаткові стилі для заголовка
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для підзаголовка
   */
  subtitleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопки Google
   */
  buttonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопки Google
   */
  buttonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для повідомлення про помилку
   */
  errorTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Кастомний компонент логотипу
   */
  renderLogo?: () => React.ReactNode;
  
  /**
   * Кастомний компонент заголовка
   */
  renderTitle?: () => React.ReactNode;
  
  /**
   * Кастомний компонент підзаголовка
   */
  renderSubtitle?: () => React.ReactNode;
  
  /**
   * Кастомний компонент кнопки входу
   */
  renderLoginButton?: (props: {
    onPress: () => void;
    loading: boolean;
    disabled: boolean;
  }) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення помилки
   */
  renderError?: (error: string) => React.ReactNode;
}

/**
 * Параметри навігації для екрану входу
 */
export type LoginScreenParams = {
  /**
   * URL для перенаправлення після успішного входу
   */
  redirectTo?: string;
  
  /**
   * Додаткові параметри для передачі на наступний екран
   */
  [key: string]: any;
};

/**
 * Властивості форми входу
 */
export interface LoginFormValues {
  /**
   * Електронна пошта
   */
  email: string;
  
  /**
   * Пароль
   */
  password: string;
  
  /**
   * Запам'ятати мене
   */
  rememberMe: boolean;
}
