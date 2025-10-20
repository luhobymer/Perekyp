/**
 * Типи для системи тем додатку
 */

/**
 * Режими теми
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Кольори теми
 */
export interface ThemeColors {
  // Основні кольори
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  
  // Фонові кольори
  background: string;
  card: string;
  surface: string;
  
  // Текстові кольори
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Статусні кольори
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Інтерфейсні кольори
  border: string;
  divider: string;
  disabled: string;
  placeholder: string;
  
  // Інші кольори
  shadow: string;
  overlay: string;
  backdrop: string;
  white: string;
  inputBackground: string;
}

/**
 * Тема додатку
 */
export interface Theme {
  colors: ThemeColors;
}

/**
 * Контекст теми
 */
export interface ThemeContextType {
  /**
   * Поточна тема
   */
  theme: Theme;
  
  /**
   * Чи активна темна тема
   */
  isDark: boolean;
  
  /**
   * Поточний режим теми
   */
  themeMode: ThemeMode;
  
  /**
   * Перемикання між темною та світлою темою
   */
  toggleTheme: () => Promise<void>;
  
  /**
   * Встановлення конкретного режиму теми
   * @param mode - режим теми
   */
  setTheme: (mode: ThemeMode) => Promise<void>;
}
