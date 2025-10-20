import { fontScale, getAdaptiveSpacing, getAdaptiveIconSize, getAdaptiveButtonSize } from '../utils/dimensions';
import { Theme, ThemeColors } from '../types/theme';

// Тема додатку в вишнево-сріблястих тонах

// Основні кольори
export const COLORS = {
  // Відтінки вишневого
  primary: '#8B0000', // Темно-вишневий
  primaryLight: '#C41E3A', // Світло-вишневий
  primaryDark: '#560319', // Дуже темний вишневий
  
  // Відтінки сріблястого
  secondary: '#C0C0C0', // Сріблястий
  secondaryLight: '#E6E6E6', // Світло-сріблястий
  secondaryDark: '#A9A9A9', // Темно-сріблястий
  
  // Допоміжні кольори
  accent: '#B87333', // Мідний (для акцентів)
  
  // Функціональні кольори
  success: '#4CAF50', // Зелений
  error: '#FF5252', // Червоний
  warning: '#FFC107', // Жовтий
  info: '#2196F3', // Синій
  
  // Нейтральні кольори
  black: '#000000',
  darkGray: '#333333',
  gray: '#666666',
  lightGray: '#BDBDBD',
  white: '#FFFFFF',
  
  // Кольори для фону
  background: '#F8F8F8',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  
  // Додаткові кольори для типізації
  textDisabled: '#BDBDBD',
  disabled: '#E0E0E0',
  placeholder: '#9E9E9E',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  divider: '#EEEEEE',
};

// Шрифти та розміри
export const FONTS = {
  sizes: {
    xs: fontScale(10),
    xsmall: fontScale(10), // Додаємо для зворотньої сумісності
    small: fontScale(12),
    medium: fontScale(14),
    large: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(22),
    title: fontScale(24),
    header: fontScale(28),
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    semibold: '600', // Додаємо для зворотньої сумісності
    bold: '700',
    extraBold: '800',
  },
  family: {
    default: 'System',
    mono: 'SpaceMono',
  }
};

// Розміри та відступи
export const SIZES = {
  // Базові відступи
  xxs: getAdaptiveSpacing(2),
  xs: getAdaptiveSpacing(4),
  xsmall: getAdaptiveSpacing(4),
  small: getAdaptiveSpacing(8),
  medium: getAdaptiveSpacing(16),
  large: getAdaptiveSpacing(24),
  xl: getAdaptiveSpacing(32),
  xxl: getAdaptiveSpacing(40),
  xxxl: getAdaptiveSpacing(80),
  
  // Радіуси заокруглень
  borderRadius: getAdaptiveSpacing(8),
  buttonRadius: getAdaptiveSpacing(12),
  cardRadius: getAdaptiveSpacing(16),
  
  // Розміри іконок
  iconSmall: getAdaptiveIconSize(16),
  iconMedium: getAdaptiveIconSize(24),
  iconLarge: getAdaptiveIconSize(32),
  
  // Розміри кнопок
  buttonHeight: getAdaptiveButtonSize(48),
  buttonPadding: getAdaptiveSpacing(12),
  inputHeight: getAdaptiveButtonSize(44),
};

// Тіні
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

// Кольори світлої теми
export const COLORS_LIGHT: ThemeColors = {
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',
  secondary: '#4F46E5',
  background: '#FFFFFF',
  card: '#F8FAFC',
  surface: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  disabled: '#E2E8F0',
  placeholder: '#94A3B8',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

// Кольори темної теми
export const COLORS_DARK: ThemeColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',
  secondary: '#6366F1',
  background: '#0F172A',
  card: '#1E293B',
  surface: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textDisabled: '#64748B',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#38BDF8',
  border: '#334155',
  divider: '#334155',
  disabled: '#475569',
  placeholder: '#64748B',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const Colors = {
  light: COLORS_LIGHT,
  dark: COLORS_DARK,
};

// Світла тема
export const lightTheme: Theme = {
  colors: COLORS_LIGHT
};

// Темна тема
export const darkTheme: Theme = {
  colors: COLORS_DARK
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  lightTheme,
  darkTheme,
};
