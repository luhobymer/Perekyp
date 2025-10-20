import { StyleProp, ViewStyle, TextStyle, ListRenderItem } from 'react-native';
import { DocumentType, SyncStatus } from './common';

export type DocumentCategory = 
  | 'all' 
  | 'registration' 
  | 'insurance' 
  | 'inspection' 
  | 'purchase' 
  | 'maintenance' 
  | 'other';


export interface DocumentFile {
  /**
   * URL до файлу документа
   */
  url: string;
  
  /**
   * MIME-тип файлу
   */
  type: string;
  
  /**
   * Назва файлу
   */
  name: string;
  
  /**
   * Розмір файлу в байтах
   */
  size: number;
  
  /**
   * Дата завантаження файлу
   */
  uploadDate?: Date;
}

export interface Document {
  /**
   * Унікальний ідентифікатор документа
   */
  id: string;
  
  /**
   * ID автомобіля, до якого належить документ
   */
  carId: string;
  
  /**
   * Тип документа
   */
  type: DocumentType;
  
  /**
   * Назва документа
   */
  title: string;
  
  /**
   * Опис документа
   */
  description?: string;
  
  /**
   * Номер документа
   */
  number?: string;
  
  /**
   * Дата видачі документа
   */
  date: Date;
  
  /**
   * Термін дії документа
   */
  expiryDate?: Date | null;
  
  /**
   * Файл документа
   */
  file?: DocumentFile;
  
  /**
   * Дата створення запису
   */
  createdAt: Date;
  
  /**
   * Дата останнього оновлення запису
   */
  updatedAt: Date;
  
  /**
   * Стан синхронізації з сервером
   */
  syncStatus?: SyncStatus;
}

export interface DocumentsListProps {
  /**
   * ID автомобіля, для якого відображаються документи
   * Якщо не вказано, відображаються всі документи
   */
  carId?: string;
  
  /**
   * Масив документів для відображення
   * Якщо не вказано, документи будуть завантажені за допомогою хука useDocuments
   */
  documents?: Document[];
  
  /**
   * Чи відображати індикатор завантаження
   * @default true
   */
  showLoadingIndicator?: boolean;
  
  /**
   * Чи дозволити оновлення списку свайпом вниз
   * @default true
   */
  pullToRefresh?: boolean;
  
  /**
   * Чи дозволити видалення документів
   * @default true
   */
  allowDeletion?: boolean;
  
  /**
   * Чи дозволити редагування документів
   * @default true
   */
  allowEditing?: boolean;
  
  /**
   * Чи дозволити додавання нових документів
   * @default true
   */
  allowAdding?: boolean;
  
  /**
   * Чи відображати фільтр за категоріями
   * @default true
   */
  showCategoryFilter?: boolean;
  
  /**
   * Чи відображати пошук
   * @default true
   */
  showSearch?: boolean;
  
  /**
   * Чи відображати сортування
   * @default true
   */
  showSorting?: boolean;
  
  /**
   * Додаткові стилі для контейнера
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка
   */
  headerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для заголовка тексту
   */
  headerTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для списку
   */
  listStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для елемента списку
   */
  itemStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту елемента списку
   */
  itemTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Додаткові стилі для кнопки додавання
   */
  addButtonStyle?: StyleProp<ViewStyle>;
  
  /**
   * Додаткові стилі для тексту кнопки додавання
   */
  addButtonTextStyle?: StyleProp<TextStyle>;
  
  /**
   * Обробник натискання на документ
   */
  onDocumentPress?: (document: Document) => void;
  
  /**
   * Обробник натискання на кнопку додавання
   */
  onAddPress?: () => void;
  
  /**
   * Обробник видалення документа
   */
  onDeleteDocument?: (documentId: string) => Promise<boolean>;
  
  /**
   * Обробник оновлення документа
   */
  onUpdateDocument?: (document: Document) => Promise<boolean>;
  
  /**
   * Обробник завантаження документів
   */
  onLoadDocuments?: (carId?: string) => Promise<Document[]>;
  
  /**
   * Кастомний компонент для відображення документа
   */
  renderItem?: ListRenderItem<Document>;
  
  /**
   * Кастомний компонент для відображення заголовка
   */
  renderHeader?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення підвалу
   */
  renderFooter?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення порожнього стану
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення помилки
   */
  renderError?: (error: Error) => React.ReactNode;
  
  /**
   * Кастомний компонент для відображення завантаження
   */
  renderLoading?: () => React.ReactNode;
}
