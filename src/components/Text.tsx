import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FONTS } from '../constants/theme';
import { TextProps, TextVariant } from '../types/components/text';

/**
 * Компонент для відображення тексту з різними варіантами стилів
 */
const Text: React.FC<TextProps> = ({ 
  children, 
  style, 
  variant = 'body',
  color,
  mono = false,
  ...props 
}) => {
  const { theme } = useTheme();

  /**
   * Отримання стилю в залежності від варіанту тексту
   */
  const getVariantStyle = () => {
    switch (variant) {
      case 'header':
        return styles.header;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      default:
        return styles.body;
    }
  };

  /**
   * Отримання шрифту в залежності від параметра mono
   */
  const getFontFamily = (): string => {
    return mono ? FONTS.family.mono : FONTS.family.default;
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { 
          color: color || theme.colors.text,
          fontFamily: getFontFamily(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: FONTS.sizes.header,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
  },
  subtitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
  },
  body: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.regular,
  },
  caption: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.regular,
  },
});

export default Text;
