/**
 * Типи для констант теми
 */

/**
 * Інтерфейс для кольорів
 */
export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  black: string;
  darkGray: string;
  gray: string;
  lightGray: string;
  white: string;
  background: string;
  card: string;
}

/**
 * Інтерфейс для кольорів теми
 */
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  white: string;
  black: string;
}

/**
 * Інтерфейс для розмірів шрифтів
 */
export interface FontSizes {
  xs: number;
  small: number;
  medium: number;
  large: number;
  xl: number;
  xxl: number;
  title: number;
  header: number;
}

/**
 * Інтерфейс для ваг шрифтів
 */
export interface FontWeights {
  light: string;
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  extraBold: string;
}

/**
 * Інтерфейс для сімейств шрифтів
 */
export interface FontFamilies {
  default: string;
  mono: string;
}

/**
 * Інтерфейс для шрифтів
 */
export interface Fonts {
  sizes: FontSizes;
  weights: FontWeights;
  family: FontFamilies;
}

/**
 * Інтерфейс для розмірів
 */
export interface Sizes {
  xsmall: number;
  small: number;
  medium: number;
  large: number;
  xl: number;
  xxl: number;
  xxxl: number;
  borderRadius: number;
  buttonRadius: number;
  cardRadius: number;
  iconSmall: number;
  iconMedium: number;
  iconLarge: number;
  buttonHeight: number;
  buttonPadding: number;
}

/**
 * Інтерфейс для тіней
 */
export interface Shadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/**
 * Інтерфейс для всіх тіней
 */
export interface Shadows {
  small: Shadow;
  medium: Shadow;
  large: Shadow;
}

/**
 * Інтерфейс для теми
 */
export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

/**
 * Інтерфейс для всіх тем
 */
export interface AllThemeColors {
  light: ThemeColors;
  dark: ThemeColors;
}
