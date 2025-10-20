import { Theme } from '@react-navigation/native';

declare module '@react-navigation/native' {
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
    success: string;
    error: string;
    warning: string;
    info: string;
    accent: string;
  }

  export interface ThemeFonts {
    regular: {
      fontFamily: string;
      fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    };
    medium: {
      fontFamily: string;
      fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    };
    bold: {
      fontFamily: string;
      fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    };
  }

  export interface ThemeSpacing {
    none: number;
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  }

  export interface Theme {
    dark: boolean;
    colors: ThemeColors;
    fonts: ThemeFonts;
    spacing: ThemeSpacing;
    roundness: number;
  }
}

declare module 'react-native' {
  interface ViewStyle {
    elevation?: number;
  }
  
  interface TextStyle {
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000' | 'ultralight' | 'thin' | 'light' | 'medium' | 'semibold' | 'heavy' | 'black';
  }
}
