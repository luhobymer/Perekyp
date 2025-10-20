import { StyleSheet, Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SIZES, FONTS, COLORS } from '../constants/theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Глобальні стилі додатку
 */
export const globalStyles = StyleSheet.create<
  NamedStyles<{
    // Контейнери
    screenContainer: ViewStyle;
    section: ViewStyle;
    centeredContainer: ViewStyle;
    
    // Заголовки та розділи
    screenHeader: ViewStyle;
    sectionHeader: ViewStyle;
    divider: ViewStyle;
    
    // Типографіка
    title: TextStyle;
    subtitle: TextStyle;
    regularText: TextStyle;
    smallText: TextStyle;
    
    // Тіні та елевації
    cardShadow: ViewStyle;
    lightShadow: ViewStyle;
    
    // Флекс-контейнери
    row: ViewStyle;
    spaceBetween: ViewStyle;
    
    // Спільні стилі для списків
    listItem: ViewStyle;
    
    // Стилі для форм
    formContainer: ViewStyle;
    
    // Стилі сповіщень
    errorText: TextStyle;
    successText: TextStyle;
    
    // Стилі для завантаження
    loadingContainer: ViewStyle;
    
    // Стилі для порожніх станів
    emptyStateContainer: ViewStyle;
    emptyStateText: TextStyle;
    emptyStateSubtext: TextStyle;
  }>
>({
  // Контейнери
  screenContainer: {
    flex: 1,
  },
  section: {
    margin: SIZES.medium,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Заголовки та розділи
  screenHeader: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    marginVertical: SIZES.medium,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: SIZES.small,
  },
  
  // Типографіка
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
  },
  subtitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SIZES.small,
  },
  regularText: {
    fontSize: FONTS.sizes.medium,
  },
  smallText: {
    fontSize: FONTS.sizes.small,
  },
  
  // Тіні та елевації
  cardShadow: Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    android: {
      elevation: 3,
    },
  }) as ViewStyle,
  lightShadow: Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 1,
    },
    android: {
      elevation: 1,
    },
  }) as ViewStyle,
  
  // Флекс-контейнери
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Спільні стилі для списків
  listItem: {
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
  },
  
  // Стилі для форм
  formContainer: {
    padding: SIZES.medium,
  },
  
  // Стилі сповіщень
  errorText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.error,
    marginTop: SIZES.small,
  },
  successText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.success,
    marginTop: SIZES.small,
  },
  
  // Стилі для завантаження
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  
  // Стилі для порожніх станів
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxxl,
    paddingHorizontal: SIZES.large,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
    marginTop: SIZES.medium,
  },
  emptyStateSubtext: {
    fontSize: FONTS.sizes.medium,
    textAlign: 'center',
    marginTop: SIZES.small,
    opacity: 0.7,
  },
});

/**
 * Стиль карточки з автомобілем
 */
export const carCardStyles = StyleSheet.create<
  NamedStyles<{
    container: ViewStyle;
    header: ViewStyle;
    titleContainer: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    statusBadge: ViewStyle;
    statusText: TextStyle;
    infoRow: ViewStyle;
    infoItem: ViewStyle;
    infoText: TextStyle;
    imageContainer: ViewStyle;
    image: ImageStyle;
    financialInfo: ViewStyle;
    priceContainer: ViewStyle;
    priceLabel: TextStyle;
    price: TextStyle;
    actions: ViewStyle;
    actionButton: ViewStyle;
    actionButtonText: TextStyle;
  }>
>({
  container: {
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
  },
  subtitle: {
    fontSize: FONTS.sizes.small,
    marginTop: SIZES.xxs,
  },
  statusBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xxs,
    borderRadius: SIZES.small,
    marginLeft: SIZES.small,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  infoText: {
    fontSize: FONTS.sizes.small,
    marginLeft: SIZES.xxs,
  },
  imageContainer: {
    height: 100,
    borderRadius: SIZES.small,
    overflow: 'hidden',
    marginTop: SIZES.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  financialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
    paddingTop: SIZES.small,
    borderTopWidth: 1,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FONTS.sizes.small,
  },
  price: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold,
    marginTop: SIZES.xxs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: SIZES.small,
  },
  actionButton: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONTS.sizes.small,
    marginLeft: SIZES.xxs,
  },
});

/**
 * Стилі для форм введення
 */
export const formStyles = StyleSheet.create<
  NamedStyles<{
    container: ViewStyle;
    inputGroup: ViewStyle;
    label: TextStyle;
    inputContainer: ViewStyle;
    input: TextStyle;
    buttonContainer: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
  }>
>({
  container: {
    padding: SIZES.medium,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium,
    marginBottom: SIZES.small,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    height: SIZES.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.medium,
  },
  buttonContainer: {
    marginTop: SIZES.large,
  },
  button: {
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.bold,
  },
});

export default globalStyles;
