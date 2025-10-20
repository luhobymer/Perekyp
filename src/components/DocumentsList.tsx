import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ListRenderItem, 
  Alert, 
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useDocuments } from '../hooks/useDocuments';
import { formatDate } from '../utils/formatters';
import { DocumentType, DocumentsListProps } from '../types/components';

// Тип для категорій документів
type DocumentCategory = 'all' | 'registration' | 'insurance' | 'inspection' | 'purchase' | 'maintenance' | 'other';

type SyncStatus = 'pending' | 'synced' | 'error';

// Тип для документа з альтернативними назвами полів
type DocumentWithLegacyFields = {
  id?: string;
  carId?: string;
  car_id?: string;
  type?: DocumentType;
  document_type?: DocumentType;
  title?: string;
  description?: string;
  number?: string;
  date?: string | Date;
  expiry_date?: string | Date | null;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  file_size?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  syncStatus?: SyncStatus;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
};

// Основний тип документа з усіма необхідними полями
type DocumentWithId = {
  id: string;
  carId: string;
  car_id: string;
  type: DocumentType;
  document_type: DocumentType;
  title: string;
  description: string;
  number: string;
  date: Date;
  expiry_date: Date | null;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  syncStatus: SyncStatus;
  // Альтернативні назви для зворотної сумісності
  fileUrl: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};

// Функція для створення документа за замовчуванням у разі помилки
const createDefaultDocument = (doc: Partial<DocumentWithLegacyFields> = {}): DocumentWithId => {
  const now = new Date();
  return {
    id: doc.id || 'temp-' + Math.random().toString(36).substr(2, 9),
    car_id: doc.car_id || doc.carId || '',
    carId: doc.carId || doc.car_id || '',
    type: (doc.type || doc.document_type || 'other') as DocumentType,
    document_type: (doc.type || doc.document_type || 'other') as DocumentType,
    title: doc.title || 'Новий документ',
    description: doc.description || '',
    number: doc.number || '',
    date: doc.date ? (doc.date instanceof Date ? doc.date : new Date(doc.date)) : new Date(),
    expiry_date: doc.expiry_date ? (doc.expiry_date instanceof Date ? doc.expiry_date : new Date(doc.expiry_date)) : null,
    file_url: doc.file_url || doc.fileUrl || '',
    file_type: doc.file_type || doc.fileType || '',
    file_name: doc.file_name || doc.fileName || '',
    file_size: doc.file_size || doc.fileSize || 0,
    created_at: doc.created_at ? (typeof doc.created_at === 'string' ? doc.created_at : doc.created_at.toISOString()) : now.toISOString(),
    updated_at: doc.updated_at ? (typeof doc.updated_at === 'string' ? doc.updated_at : doc.updated_at.toISOString()) : now.toISOString(),
    syncStatus: doc.syncStatus || 'synced',
    fileUrl: doc.file_url || doc.fileUrl || '',
    fileType: doc.file_type || doc.fileType || '',
    fileName: doc.file_name || doc.fileName || '',
    fileSize: doc.file_size || doc.fileSize || 0,
    createdAt: doc.createdAt ? (typeof doc.createdAt === 'string' ? doc.createdAt : doc.createdAt.toISOString()) : now.toISOString(),
    updatedAt: doc.updatedAt ? (typeof doc.updatedAt === 'string' ? doc.updatedAt : doc.updatedAt.toISOString()) : now.toISOString()
  };
};

// Функція для конвертації документу з API у DocumentWithId
const convertToDocumentWithId = (doc: DocumentWithLegacyFields): DocumentWithId => {
  // Використовуємо функцію створення документа за замовчуванням
  const defaultDoc = createDefaultDocument(doc);
  
  // Оновлюємо поля, які можуть бути в старому форматі
  return {
    ...defaultDoc,
    id: doc.id || defaultDoc.id,
    carId: doc.carId || doc.car_id || defaultDoc.carId,
    car_id: doc.car_id || doc.carId || defaultDoc.car_id,
    type: (doc.type || doc.document_type || defaultDoc.type) as DocumentType,
    document_type: (doc.document_type || doc.type || defaultDoc.document_type) as DocumentType,
    title: doc.title || defaultDoc.title,
    description: doc.description || defaultDoc.description,
    number: doc.number || defaultDoc.number,
    date: doc.date ? (doc.date instanceof Date ? doc.date : new Date(doc.date)) : defaultDoc.date,
    expiry_date: doc.expiry_date ? (doc.expiry_date instanceof Date ? doc.expiry_date : new Date(doc.expiry_date)) : null,
    file_url: doc.file_url || doc.fileUrl || defaultDoc.file_url,
    file_type: doc.file_type || doc.fileType || defaultDoc.file_type,
    file_name: doc.file_name || doc.fileName || defaultDoc.file_name,
    file_size: doc.file_size || doc.fileSize || defaultDoc.file_size,
    syncStatus: doc.syncStatus || defaultDoc.syncStatus,
    fileUrl: doc.fileUrl || doc.file_url || defaultDoc.fileUrl,
    fileType: doc.fileType || doc.file_type || defaultDoc.fileType,
    fileName: doc.fileName || doc.file_name || defaultDoc.fileName,
    fileSize: doc.fileSize || doc.file_size || defaultDoc.fileSize,
    created_at: doc.created_at ? (typeof doc.created_at === 'string' ? doc.created_at : doc.created_at.toISOString()) : defaultDoc.created_at,
    updated_at: doc.updated_at ? (typeof doc.updated_at === 'string' ? doc.updated_at : doc.updated_at.toISOString()) : defaultDoc.updated_at,
    createdAt: doc.createdAt ? (typeof doc.createdAt === 'string' ? doc.createdAt : doc.createdAt.toISOString()) : defaultDoc.createdAt,
    updatedAt: doc.updatedAt ? (typeof doc.updatedAt === 'string' ? doc.updatedAt : doc.updatedAt.toISOString()) : defaultDoc.updatedAt
  };
};

export const DocumentsList: React.FC<DocumentsListProps> = ({ carId, navigation }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentWithId[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('all');
  
  const { getDocuments, deleteDocument } = useDocuments();
  
  const loadDocuments = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const docs = await getDocuments(carId);
      
      // Переконуємо TypeScript, що docs є масивом DocumentWithLegacyFields
      const legacyDocs = (docs || []) as unknown as DocumentWithLegacyFields[];
      
      // Конвертуємо кожен документ до потрібного формату
      const docsWithId = legacyDocs.map(doc => {
        try {
          return convertToDocumentWithId(doc);
        } catch (convertError) {
          console.error('Помилка конвертації документа:', convertError, doc);
          return createDefaultDocument(doc);
        }
      });
      
      // Фільтруємо документи за вибраною категорією
      const filteredDocuments = selectedCategory === 'all' 
        ? documents 
        : documents.filter(doc => doc.document_type === selectedCategory);
      
      setDocuments(filteredDocuments);
      
      // Якщо немає документів після фільтрації, встановлюємо відповідне повідомлення
      if (filteredDocuments.length === 0 && docsWithId.length > 0) {
        setError('Документи обраного типу відсутні');
      } else if (docsWithId.length === 0) {
        setError('Документи відсутні');
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Помилка завантаження документів: ${err.message}` 
        : 'Сталася невідома помилка під час завантаження документів';
      setError(errorMessage);
      console.error('Error loading documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [carId, getDocuments, selectedCategory]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDeleteDocument = async (documentId: string): Promise<void> => {
    if (!documentId) {
      console.error('Помилка: ID документа не вказано');
      return;
    }

    try {
      // Оновлюємо стан для відображення завантаження
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.id === documentId ? { ...doc, syncStatus: 'pending' as const } : doc
        )
      );

      // Видаляємо документ
      await deleteDocument(documentId);
      
      // Оновлюємо стан після успішного видалення
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      
      // Показуємо сповіщення про успішне видалення
      Alert.alert(
        'Успіх',
        'Документ успішно видалено',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Помилка при видаленні документа:', error);
      
      // Відновлюємо статус документу у разі помилки
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.id === documentId ? { ...doc, syncStatus: 'error' as const } : doc
        )
      );
      
      // Показуємо повідомлення про помилку
      Alert.alert(
        'Помилка',
        'Не вдалося видалити документ. Будь ласка, перевірте підключення до мережі та спробуйте ще раз.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDocumentItem: ListRenderItem<DocumentWithId> = ({ item }) => (
    <TouchableOpacity 
      style={[styles.documentItem, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation?.navigate('ViewDocument', { 
        documentId: item.id,
        carId,
        document: item
      })}
    >
      <View style={styles.documentHeader}>
        <Text style={[styles.documentType, { color: theme.colors.primary }]}>
          {item.document_type}
        </Text>
        <Text style={[styles.documentNumber, { color: theme.colors.text }]}>
          {item.title}
        </Text>
      </View>
      
      {item.description && (
        <Text style={[styles.documentDescription, { color: theme.colors.text }]}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.documentFooter}>
        {item.expiry_date && (
          <Text style={[styles.documentDate, { color: theme.colors.textSecondary }]}>
            Дійсний до: {formatDate(item.expiry_date)}
          </Text>
        )}
        <TouchableOpacity 
          onPress={() => handleDeleteDocument(item.id)}
          style={styles.deleteButton}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.error }]}>
            Видалити
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const documentCategories: { id: DocumentCategory; label: string }[] = [
    { id: 'all', label: 'Всі' },
    { id: 'registration', label: 'Реєстрація' },
    { id: 'insurance', label: 'Страховка' },
    { id: 'maintenance', label: 'Техогляд' },
    { id: 'inspection', label: 'Огляд' },
    { id: 'purchase', label: 'Купівля' },
    { id: 'other', label: 'Інше' }
  ];

  const handleCategoryChange = (category: DocumentCategory) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: theme.colors.error, marginBottom: 20, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity 
          style={{ backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8 }}
          onPress={loadDocuments}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Спробувати знову
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Документи
        </Text>
      </View>

      <View style={styles.typesContainer}>
        {documentCategories.map(({ id, label }) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.typeButton,
              { 
                backgroundColor: selectedCategory === id 
                  ? theme.colors.primary 
                  : theme.colors.card 
              }
            ]}
            onPress={() => handleCategoryChange(id)}
          >
            <Text
              style={[
                styles.typeText,
                { 
                  color: selectedCategory === id 
                    ? theme.colors.background 
                    : theme.colors.text 
                }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Немає документів для відображення
          </Text>
        }
      />

      <TouchableOpacity
        style={{ 
          backgroundColor: theme.colors.primary,
          margin: 16,
          padding: 12,
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={() => navigation.navigate('AddDocument', { carId })}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Додати документ</Text>
      </TouchableOpacity>

      {/* Тут буде модальне вікно для додавання/редагування документа */}
      {/* <DocumentFormModal
        visible={isAddingDocument}
        onClose={() => setIsAddingDocument(false)}
        onSubmit={handleAddDocument}
      /> */}
    </View>
  );
};

// Стилі
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  documentItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentType: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  documentNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  documentDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});

export default DocumentsList;
