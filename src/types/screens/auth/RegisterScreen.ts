import { StyleProp, ViewStyle, TextStyle, TextInputProps } from 'react-native';

/**
 * Пропси для екрану реєстрації
 */
export interface RegisterScreenProps {
  /**
   * Обробник реєстрації
   * @param email Електронна пошта
   * @param password Пароль
   */
  onRegister?: (email: string, password: string) => Promise<void>;
  
  /**
   * Обробник переходу на екран входу
   */
  onNavigateToLogin?: () => void;
  
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
   * Додаткові стилі для заголовка
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для полів вводу
   */
  inputStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопки реєстрації
   */
  buttonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопки реєстрації
   */
  buttonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопки переходу на вхід
   */
  linkButtonStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для повідомлення про помилку
   */
  errorTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Властивості для поля електронної пошти
   */
  emailInputProps?: Partial<TextInputProps>;
  
  /**
   * Властивості для поля паролю
   */
  passwordInputProps?: Partial<TextInputProps>;
  
  /**
   * Властивості для поля підтвердження паролю
   */
  confirmPasswordInputProps?: Partial<TextInputProps>;
  
  /**
   * Кастомний компонент форми
   */
  renderForm?: (props: {
    email: string;
    onEmailChange: (email: string) => void;
    password: string;
    onPasswordChange: (password: string) => void;
    confirmPassword: string;
    onConfirmPasswordChange: (confirmPassword: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
  }) => React.ReactNode;
  
  /**
   * Кастомний компонент кнопки реєстрації
   */
  renderRegisterButton?: (props: {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
  }) => React.ReactNode;
  
  /**
   * Кастомний компонент кнопки переходу на вхід
   */
  renderLoginLink?: (props: {
    onPress: () => void;
  }) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення помилки
   */
  renderError?: (error: string) => React.ReactNode;
}

/**
 * Параметри навігації для екрану реєстрації
 */
export type RegisterScreenParams = {
  /**
   * URL для перенаправлення після успішної реєстрації
   */
  redirectTo?: string;
  
  /**
   * Додаткові параметри для передачі на наступний екран
   */
  [key: string]: any;
};

/**
 * Властивості форми реєстрації
 */
export interface RegisterFormValues {
  /**
   * Електронна пошта
   */
  email: string;
  
  /**
   * Пароль
   */
  password: string;
  
  /**
   * Підтвердження паролю
   */
  confirmPassword: string;
  
  /**
   * Умови використання
   */
  termsAccepted: boolean;
}
