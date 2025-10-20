import { ReactNode } from 'react';
import { StyleProp, TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';

/**
 * Типи для кнопок
 */
export type ButtonType = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Інтерфейс для компонента Button
 */
export interface ButtonProps extends TouchableOpacityProps {
  /** Текст кнопки */
  title: string;
  /** Функція, яка викликається при натисканні */
  onPress: () => void;
  /** Тип кнопки */
  type?: ButtonType;
  /** Розмір кнопки */
  size?: ButtonSize;
  /** Чи є кнопка неактивною */
  disabled?: boolean;
  /** Чи показувати індикатор завантаження */
  loading?: boolean;
  /** Іконка для відображення в кнопці */
  icon?: ReactNode;
  /** Позиція іконки */
  iconPosition?: 'left' | 'right';
  /** Стилі для контейнера кнопки */
  style?: StyleProp<ViewStyle>;
  /** Стилі для тексту кнопки */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Інтерфейс для компонента Input
 */
export interface InputProps {
  /** Значення поля вводу */
  value: string;
  /** Функція, яка викликається при зміні значення */
  onChangeText: (text: string) => void;
  /** Заповнювач поля вводу */
  placeholder?: string;
  /** Мітка для поля вводу */
  label?: string;
  /** Чи є поле вводу неактивним */
  disabled?: boolean;
  /** Чи є поле вводу редагованим */
  editable?: boolean;
  /** Текст помилки */
  error?: string | null;
  /** Чи є поле вводу паролем */
  secureTextEntry?: boolean;
  /** Чи є поле вводу багаторядковим */
  multiline?: boolean;
  /** Кількість рядків для багаторядкового поля */
  numberOfLines?: number;
  /** Стилі для контейнера поля вводу */
  containerStyle?: StyleProp<ViewStyle>;
  /** Стилі для поля вводу */
  inputStyle?: StyleProp<TextStyle>;
  /** Стилі для мітки */
  labelStyle?: StyleProp<TextStyle>;
  /** Стилі для повідомлення про помилку */
  errorStyle?: StyleProp<TextStyle>;
  /** Загальні стилі */
  style?: StyleProp<ViewStyle>;
  /** Іконка для відображення в полі вводу */
  icon?: ReactNode;
  /** Позиція іконки */
  iconPosition?: 'left' | 'right';
  /** Функція, яка викликається при натисканні на іконку */
  onIconPress?: () => void;
  /** Тип клавіатури */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search';
  /** Автоматичне виправлення */
  autoCorrect?: boolean;
  /** Автоматична капіталізація */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Автоматичне заповнення */
  autoComplete?: 'off' | 'additional-name' | 'address-line1' | 'address-line2' | 'cc-csc' | 'cc-exp' | 'cc-exp-day' | 'cc-exp-month' | 'cc-exp-year' | 'cc-number' | 'email' | 'name' | 'name-family' | 'name-given' | 'name-middle' | 'password' | 'postal-code' | 'street-address' | 'tel' | 'username' | 'current-password' | 'new-password' | 'one-time-code' | 'organization' | 'organization-title' | 'tel-country-code' | 'tel-national';
  /** Максимальна довжина тексту */
  maxLength?: number;
  /** Мінімальна довжина тексту */
  minLength?: number;
  /** Чи є поле вводу обов'язковим */
  required?: boolean;
  /** Функція, яка викликається при фокусі */
  onFocus?: () => void;
  /** Функція, яка викликається при втраті фокусу */
  onBlur?: () => void;
  /** Тип клавіші повернення */
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'none' | 'previous' | 'default' | 'emergency-call' | 'google' | 'join' | 'route' | 'yahoo';
  /** Функція, яка викликається при натисканні клавіші Enter */
  onSubmitEditing?: () => void;
  /** Посилання на поле вводу */
  ref?: any;
}
