import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }: ScaledSize = Dimensions.get('window');

// Базова ширина для розрахунку (iPhone 11)
const baseWidth: number = 375;
const baseHeight: number = 812;

/**
 * Функція для адаптивного розміру по ширині
 * @param widthPercent - Відсоток ширини екрану або числове значення
 * @returns Адаптивне значення ширини у пікселях
 */
export const wp = (widthPercent: number | string): number => {
  const elemWidth: number = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Функція для адаптивного розміру по висоті
 * @param heightPercent - Відсоток висоти екрану або числове значення
 * @returns Адаптивне значення висоти у пікселях
 */
export const hp = (heightPercent: number | string): number => {
  const elemHeight: number = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

/**
 * Функція для адаптивного розміру шрифту
 * @param size - Базовий розмір шрифту
 * @returns Адаптивний розмір шрифту у пікселях
 */
export const fontScale = (size: number): number => {
  const scale: number = SCREEN_WIDTH / baseWidth;
  const newSize: number = size * scale;
  return PixelRatio.roundToNearestPixel(newSize);
};

/**
 * Перевіряє, чи пристрій є планшетом
 * @returns true, якщо ширина екрану більше або дорівнює 768
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768; // iPad mini починається з 768pt
};

/**
 * Отримує адаптивні відступи
 * @param size - Базовий розмір відступу
 * @returns Адаптивне значення відступу у пікселях
 */
export const getAdaptiveSpacing = (size: number): number => {
  const scale: number = SCREEN_WIDTH / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Отримує адаптивні розміри іконок
 * @param size - Базовий розмір іконки
 * @returns Адаптивне значення розміру іконки у пікселях
 */
export const getAdaptiveIconSize = (size: number): number => {
  const scale: number = SCREEN_WIDTH / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Отримує адаптивні розміри кнопок
 * @param size - Базовий розмір кнопки
 * @returns Адаптивне значення розміру кнопки у пікселях
 */
export const getAdaptiveButtonSize = (size: number): number => {
  const scale: number = SCREEN_WIDTH / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

const dimensions = {
  wp,
  hp,
  fontScale,
  isTablet,
  getAdaptiveSpacing,
  getAdaptiveIconSize,
  getAdaptiveButtonSize,
};

export default dimensions;
