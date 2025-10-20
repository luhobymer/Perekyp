import { useWindowDimensions } from 'react-native';

// Типи для адаптивних стилів
export interface ResponsiveOptions<T> {
  small?: T;
  medium?: T;
  large?: T;
  default: T;
}

export interface ResponsiveStylesHook {
  width: number;
  height: number;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  getResponsiveValue: <T>(options: ResponsiveOptions<T>) => T;
  getResponsiveFontSize: (baseSize: number) => number;
  getResponsiveSpacing: (baseSpacing: number) => number;
}

export const useResponsiveStyles = (): ResponsiveStylesHook => {
  const { width, height } = useWindowDimensions();

  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 768;
  const isLargeDevice = width >= 768;
  
  const getResponsiveValue = <T>(options: ResponsiveOptions<T>): T => {
    if (isSmallDevice && options.small !== undefined) {
      return options.small;
    } else if (isMediumDevice && options.medium !== undefined) {
      return options.medium;
    } else if (isLargeDevice && options.large !== undefined) {
      return options.large;
    }
    
    return options.default;
  };

  const getResponsiveFontSize = (baseSize: number): number => {
    if (isSmallDevice) {
      return baseSize * 0.85;
    } else if (isMediumDevice) {
      return baseSize;
    } else {
      return baseSize * 1.15;
    }
  };

  const getResponsiveSpacing = (baseSpacing: number): number => {
    if (isSmallDevice) {
      return baseSpacing * 0.75;
    } else if (isMediumDevice) {
      return baseSpacing;
    } else {
      return baseSpacing * 1.5;
    }
  };

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    getResponsiveValue,
    getResponsiveFontSize,
    getResponsiveSpacing,
  };
}; 

export default useResponsiveStyles;
