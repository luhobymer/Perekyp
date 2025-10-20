import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { CalendarEvent } from '../../hooks/useCalendar';

export interface EventFormProps {
  /**
   * Об'єкт події для редагування. Якщо не вказано, буде створено нову подію.
   */
  event?: Partial<CalendarEvent>;
  
  /**
   * Обробник збереження події
   * @param event - Об'єкт події, який містить оновлені дані
   */
  onSave: (event: CalendarEvent) => void;
  
  /**
   * Обробник скасування створення/редагування події
   */
  onCancel: () => void;
  
  /**
   * Чи відображати кнопку скасування
   * @default true
   */
  showCancelButton?: boolean;
  
  /**
   * Текст кнопки збереження
   * @default 'Зберегти'
   */
  saveButtonText?: string;
  
  /**
   * Текст кнопки скасування
   * @default 'Скасувати'
   */
  cancelButtonText?: string;
  
  /**
   * Чи показувати індикатор завантаження
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Повідомлення про помилку
   */
  error?: string | null;
  
  /**
   * Додаткові стилі для контейнера форми
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка форми
   */
  titleStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для полів вводу
   */
  inputStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для міток полів
   */
  labelStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопок
   */
  buttonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопок
   */
  buttonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для контейнера кнопок
   */
  buttonsContainerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Чи дозволити зміну календаря
   * @default true
   */
  allowCalendarChange?: boolean;
  
  /**
   * ID календаря за замовчуванням
   */
  defaultCalendarId?: string;
  
  /**
   * Чи валідувати обов'язкові поля перед збереженням
   * @default true
   */
  validateOnSave?: boolean;
  
  /**
   * Масив імен обов'язкових полів
   * @default ['title', 'startDate']
   */
  requiredFields?: Array<keyof CalendarEvent>;
  
  /**
   * Обробник помилок валідації
   * @param errors - Об'єкт з помилками валідації
   */
  onValidationError?: (errors: Record<string, string>) => void;
}
