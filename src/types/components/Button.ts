import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export type IconPosition = 'left' | 'right';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
  hitSlop?: number | { top?: number; left?: number; bottom?: number; right?: number };
  activeOpacity?: number;
  hasTVPreferredFocus?: boolean;
  nextFocusDown?: number;
  nextFocusForward?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
  nextFocusUp?: number;
  tvParallaxProperties?: any;
  delayLongPress?: number;
  delayPressIn?: number;
  delayPressOut?: number;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  onLayout?: (event: any) => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  pressRetentionOffset?: { top: number; left: number; bottom: number; right: number };
  touchSoundDisabled?: boolean;
}
