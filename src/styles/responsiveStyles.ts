import { StyleSheet, Dimensions, Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SIZES, FONTS, COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Визначаємо розміри екрану
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

/**
 * Функція для отримання адаптивних значень
 */
export const getResponsiveValue = <T>(smallValue: T, mediumValue: T, largeValue: T): T => {
  if (isSmallDevice) return smallValue;
  if (isMediumDevice) return mediumValue;
  return largeValue;
};

/**
 * Адаптивні розміри
 */
const getResponsiveSize = (small: number, medium: number, large: number): number => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

type ResponsiveContainersStyles = {
  screenContainer: ViewStyle;
  cardContainer: ViewStyle;
  listContainer: ViewStyle;
  formContainer: ViewStyle;
};

/**
 * Адаптивні стилі для контейнерів
 */
export const responsiveContainers = StyleSheet.create<ResponsiveContainersStyles>({
  screenContainer: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
  cardContainer: {
    padding: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
    marginBottom: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
    borderRadius: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
  listContainer: {
    paddingHorizontal: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
  formContainer: {
    padding: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
});

type ResponsiveTypographyStyles = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  caption: TextStyle;
};

/**
 * Адаптивна типографія
 */
export const responsiveTypography: ResponsiveTypographyStyles = {
  h1: {
    fontSize: getResponsiveValue(SIZES.xl, SIZES.xxl, SIZES.xxxl),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.bold as any,
    lineHeight: getResponsiveValue(SIZES.xl * 1.2, SIZES.xxl * 1.2, SIZES.xxxl * 1.2),
  },
  h2: {
    fontSize: getResponsiveValue(SIZES.large, SIZES.xl, SIZES.xxl),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.bold as any,
    lineHeight: getResponsiveValue(SIZES.large * 1.2, SIZES.xl * 1.2, SIZES.xxl * 1.2),
  },
  h3: {
    fontSize: getResponsiveValue(SIZES.medium, SIZES.large, SIZES.xl),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.semiBold as any,
    lineHeight: getResponsiveValue(SIZES.medium * 1.2, SIZES.large * 1.2, SIZES.xl * 1.2),
  },
  subtitle: {
    fontSize: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.semiBold as any,
    lineHeight: getResponsiveValue(SIZES.small * 1.3, SIZES.medium * 1.3, SIZES.large * 1.3),
  },
  body: {
    fontSize: getResponsiveValue(14, 16, 18),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.regular as any,
    lineHeight: getResponsiveValue(14 * 1.5, 16 * 1.5, 18 * 1.5),
  },
  body1: {
    fontSize: getResponsiveValue(16, 18, 20),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.regular as any,
    lineHeight: getResponsiveValue(16 * 1.5, 18 * 1.5, 20 * 1.5),
  },
  body2: {
    fontSize: getResponsiveValue(14, 16, 18),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.regular as any,
    lineHeight: getResponsiveValue(14 * 1.5, 16 * 1.5, 18 * 1.5),
  },
  caption: {
    fontSize: getResponsiveValue(12, 14, 16),
    fontFamily: FONTS.family.default,
    fontWeight: FONTS.weights.regular as any,
    lineHeight: getResponsiveValue(12 * 1.5, 14 * 1.5, 16 * 1.5),
  },
};

type ResponsiveImagesStyles = {
  carImage: ImageStyle;
  thumbnail: ImageStyle;
};

/**
 * Адаптивні стилі для зображень
 */
export const responsiveImages = StyleSheet.create<ResponsiveImagesStyles>({
  carImage: {
    width: '100%',
    height: getResponsiveSize(150, 200, 250),
    borderRadius: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
  thumbnail: {
    width: getResponsiveSize(60, 80, 100),
    height: getResponsiveSize(60, 80, 100),
    borderRadius: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
});

type ResponsiveButtonsStyles = {
  primary: ViewStyle;
  secondary: ViewStyle;
};

/**
 * Адаптивні стилі для кнопок
 */
export const responsiveButtons: ResponsiveButtonsStyles = {
  primary: {
    paddingHorizontal: getResponsiveValue(SIZES.medium, SIZES.large, SIZES.xl),
    borderRadius: getResponsiveValue(SIZES.xxs, SIZES.xs, SIZES.small),
  },
  secondary: {
    paddingHorizontal: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    borderRadius: getResponsiveValue(SIZES.xxs, SIZES.xs, SIZES.small),
  },
};

type ResponsiveFormsStyles = {
  input: ViewStyle;
  label: TextStyle;
};

/**
 * Адаптивні стилі для форм
 */
export const responsiveForms: ResponsiveFormsStyles = {
  input: {
    height: getResponsiveValue(40, 48, 56),
    paddingHorizontal: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    borderRadius: getResponsiveValue(SIZES.xxs, SIZES.xs, SIZES.small),
    borderWidth: 1,
  },
  label: {
    marginBottom: getResponsiveValue(SIZES.xxs, SIZES.xs, SIZES.small),
    ...responsiveTypography.caption,
  },
};

type ResponsiveGridStyles = {
  container: ViewStyle;
  item: ViewStyle;
};

/**
 * Адаптивні стилі для сітки
 */
export const responsiveGrid = StyleSheet.create<ResponsiveGridStyles>({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -getResponsiveSize(SIZES.xxs, SIZES.xs, SIZES.small),
  },
  item: {
    width: isSmallDevice ? '100%' : isMediumDevice ? '50%' : '33.33%',
    padding: getResponsiveSize(SIZES.xxs, SIZES.xs, SIZES.small),
  },
});

type ResponsiveNavigationStyles = {
  header: ViewStyle;
  tabBar: ViewStyle;
};

/**
 * Адаптивні стилі для навігації
 */
export const responsiveNavigation = StyleSheet.create<ResponsiveNavigationStyles>({
  header: {
    height: getResponsiveSize(50, 60, 70),
    paddingHorizontal: getResponsiveSize(SIZES.small, SIZES.medium, SIZES.large),
  },
  tabBar: {
    height: getResponsiveSize(50, 60, 70),
    paddingBottom: getResponsiveSize(SIZES.xxs, SIZES.xs, SIZES.small),
  },
});

type ResponsiveModalsStyles = {
  container: ViewStyle;
  header: ViewStyle;
  content: ViewStyle;
};

/**
 * Адаптивні стилі для модальних вікон
 */
export const responsiveModals = StyleSheet.create<ResponsiveModalsStyles>({
  container: {
    padding: getResponsiveSize(SIZES.medium, SIZES.large, SIZES.xl),
    borderRadius: getResponsiveSize(SIZES.medium, SIZES.large, SIZES.xl),
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  header: {
    marginBottom: getResponsiveSize(SIZES.medium, SIZES.large, SIZES.xl),
  },
  content: {
    marginBottom: getResponsiveSize(SIZES.medium, SIZES.large, SIZES.xl),
  },
});

export default {
  responsiveContainers,
  responsiveTypography,
  responsiveImages,
  responsiveButtons,
  responsiveForms,
  responsiveGrid,
  responsiveNavigation,
  responsiveModals,
  getResponsiveValue,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
};
