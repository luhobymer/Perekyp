import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  FlatList,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import carService from '../../services/carService';
import Button from '../../components/Button';
import { SIZES, FONTS } from '../../constants/theme';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  Document, 
  DocumentType, 
  DocumentTypeInfo,
  DocumentScreenParams,
  DocumentPickerResult
} from '../../types/documents';

// Типи документів для авто
const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  { id: 'technical_passport', icon: 'document-text-outline' },
  { id: 'insurance', icon: 'shield-checkmark-outline' },
  { id: 'purchase_agreement', icon: 'receipt-outline' },
  { id: 'sale_agreement', icon: 'cash-outline' },
  { id: 'service_book', icon: 'book-outline' },
  { id: 'inspection_report', icon: 'clipboard-outline' },
  { id: 'other', icon: 'document-outline' }
];

// Типи для навігації
type RootStackParamList = {
  CarDocuments: DocumentScreenParams;
  CarDetails: { carId: string | number };
};

type CarDocumentsScreenRouteProp = RouteProp<RootStackParamList, 'CarDocuments'>;
type CarDocumentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CarDocumentsScreenProps {
  route: CarDocumentsScreenRouteProp;
  navigation: CarDocumentsScreenNavigationProp;
}

const CarDocumentsScreen: React.FC<CarDocumentsScreenProps> = ({ route, navigation }) => {
  const { carId, carMake, carModel } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  
  // Завантаження списку документів
  useEffect(() => {
    loadDocuments();
  }, [carId]);
  
  // Функція отримання списку документів
  const loadDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      const documentsData = await carService.getCarDocuments(carId);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading documents:', error);
      Alert.alert(
        t('error'),
        t('error_loading_documents', { defaultValue: 'Помилка при завантаженні документів' })
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Функція для перекладу типу документа
  const getDocumentTypeLabel = useCallback((type: DocumentType): string => {
    switch (type) {
      case 'technical_passport':
        return t('technical_passport', { defaultValue: 'Технічний паспорт' });
      case 'insurance':
        return t('insurance', { defaultValue: 'Страховка' });
      case 'purchase_agreement':
        return t('purchase_agreement', { defaultValue: 'Договір купівлі' });
      case 'sale_agreement':
        return t('sale_agreement', { defaultValue: 'Договір продажу' });
      case 'service_book':
        return t('service_book', { defaultValue: 'Сервісна книжка' });
      case 'inspection_report':
        return t('inspection_report', { defaultValue: 'Звіт про огляд' });
      case 'other':
        return t('other', { defaultValue: 'Інше' });
      default:
        return type;
    }
  }, [t]);
  
  // Функція для вибору та завантаження документу
  const pickAndUploadDocument = async (documentType: DocumentType): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });
      
      if (result.canceled) {
        return;
      }
      
      const asset = result.assets[0];
      if (!asset) {
        return;
      }
      
      // Перевірка розміру файлу (макс. 10 МБ)
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      if (fileInfo.size > 10 * 1024 * 1024) {
        Alert.alert(
          t('error'),
          t('file_size_limit', { defaultValue: 'Розмір файлу не повинен перевищувати 10 МБ' })
        );
        return;
      }
      
      setUploadLoading(true);
      
      try {
        // Тут буде код для завантаження файлу на сервер
        // В реальному додатку використовуємо API для завантаження
        
        // Імітуємо завантаження
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Створюємо новий документ з імітованими даними
        const newDocument: Document = {
          id: Date.now().toString(),
          carId,
          type: documentType,
          name: asset.name,
          fileUrl: asset.uri,
          fileSize: fileInfo.size,
          mimeType: asset.mimeType || '',
          uploadDate: new Date().toISOString(),
        };
        
        // Додаємо документ до списку
        setDocuments(prevDocuments => [...prevDocuments, newDocument]);
        
        Alert.alert(
          t('success'),
          t('document_uploaded_successfully', { defaultValue: 'Документ успішно завантажено' })
        );
      } catch (error) {
        console.error('Error uploading document:', error);
        Alert.alert(
          t('error'),
          t('error_uploading_document', { defaultValue: 'Помилка при завантаженні документу' })
        );
      } finally {
        setUploadLoading(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        t('error'),
        t('error_picking_document', { defaultValue: 'Помилка при виборі документу' })
      );
    }
  };
  
  // Функція для відкриття документу
  const openDocument = async (fileUrl: string): Promise<void> => {
    try {
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert(
        t('error'),
        t('error_opening_document', { defaultValue: 'Помилка при відкритті документу' })
      );
    }
  };
  
  // Функція для видалення документу
  const deleteDocument = useCallback((documentId: string | number, documentName: string): void => {
    Alert.alert(
      t('confirm_delete', { defaultValue: 'Підтвердження видалення' }),
      t('confirm_delete_document', { 
        defaultValue: 'Ви впевнені, що хочете видалити документ {{name}}?',
        name: documentName
      }),
      [
        {
          text: t('cancel', { defaultValue: 'Скасувати' }),
          style: 'cancel',
        },
        {
          text: t('delete', { defaultValue: 'Видалити' }),
          style: 'destructive',
          onPress: async () => {
            try {
              // Тут буде код для видалення документу з сервера
              // В реальному додатку використовуємо API для видалення
              
              // Видаляємо документ зі списку
              setDocuments(prevDocuments => 
                prevDocuments.filter(doc => doc.id !== documentId)
              );
              
              Alert.alert(
                t('success'),
                t('document_deleted_successfully', { defaultValue: 'Документ успішно видалено' })
              );
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert(
                t('error'),
                t('error_deleting_document', { defaultValue: 'Помилка при видаленні документу' })
              );
            }
          },
        },
      ]
    );
  }, [t]);
  
  // Відображення елементу списку документів
  const renderDocumentItem = useCallback(({ item }: { item: Document }) => {
    const documentType = DOCUMENT_TYPES.find(type => type.id === item.type);
    const iconName = documentType ? documentType.icon : 'document-outline';
    
    return (
      <View style={[
        styles.documentItem, 
        { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }
      ]}>
        <TouchableOpacity 
          style={styles.documentInfo}
          onPress={() => openDocument(item.fileUrl)}
        >
          <View style={{ backgroundColor: theme.colors.primary, padding: 8, borderRadius: 8 }}>
            <Ionicons name={iconName as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.documentDetails}>
            <Text style={[styles.documentType, { color: theme.colors.text }]}>
              {getDocumentTypeLabel(item.type)}
            </Text>
            <Text style={[styles.documentName, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteDocument(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  }, [theme, getDocumentTypeLabel, deleteDocument, openDocument]);
  
  // Відображення заголовку з розділяючою лінією
  const renderSectionHeader = useCallback((title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
    </View>
  ), [theme]);
  
  // Відображення типів документів для додавання
  const renderDocumentTypes = useCallback(() => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.documentTypesContainer}
    >
      {DOCUMENT_TYPES.map((docType) => (
        <TouchableOpacity
          key={docType.id}
          style={[
            styles.documentTypeItem, 
            { 
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.shadow
            }
          ]}
          onPress={() => pickAndUploadDocument(docType.id)}
          disabled={uploadLoading}
        >
          <Ionicons 
            name={docType.icon as any} 
            size={32} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.documentTypeText, { color: theme.colors.text }]}>
            {getDocumentTypeLabel(docType.id)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ), [theme, getDocumentTypeLabel, pickAndUploadDocument, uploadLoading]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Заголовок */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.carTitle, { color: theme.colors.textSecondary }]}>
          {`${carMake} ${carModel}`}
        </Text>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
          {t('documents', { defaultValue: 'Документи' })}
        </Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Розділ додавання документів */}
        {renderSectionHeader(t('add_document', { defaultValue: 'Додати документ' }))}
        
        {/* Типи документів для додавання */}
        {uploadLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              {t('uploading_document', { defaultValue: 'Завантаження документу...' })}
            </Text>
          </View>
        ) : (
          renderDocumentTypes()
        )}
        
        {/* Розділ існуючих документів */}
        {renderSectionHeader(t('existing_documents', { defaultValue: 'Існуючі документи' }))}
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : documents.length > 0 ? (
          <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            style={styles.documentsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="document-text-outline" 
              size={48} 
              color={theme.colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('no_documents_yet', { defaultValue: 'Немає документів' })}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              {t('add_documents_by_selecting', { defaultValue: 'Додайте документи, вибравши тип вище' })}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
  },
  carTitle: {
    fontSize: FONTS.sizes.medium,
    marginBottom: SIZES.xxs,
  },
  screenTitle: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold as any,
  },
  content: {
    padding: SIZES.medium,
  },
  sectionHeader: {
    marginVertical: SIZES.medium,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.semiBold as any,
    marginBottom: SIZES.small,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  documentTypesContainer: {
    paddingVertical: SIZES.small,
  },
  documentTypeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginRight: SIZES.medium,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        boxShadow: '0px 2px 2px rgba(0,0,0,0.2)',
      },
    }),
  },
  documentTypeText: {
    fontSize: FONTS.sizes.small,
    textAlign: 'center',
    marginTop: SIZES.small,
  },
  documentsList: {
    marginTop: SIZES.small,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.small,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
      },
      android: {
        boxShadow: '0px 1px 1px rgba(0,0,0,0.1)',
      },
    }),
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: SIZES.medium,
    flex: 1,
  },
  documentType: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
    marginBottom: SIZES.xxs,
  },
  documentName: {
    fontSize: FONTS.sizes.small,
  },
  deleteButton: {
    padding: SIZES.small,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
  },
  loadingText: {
    marginTop: SIZES.small,
    fontSize: FONTS.sizes.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large * 2,
  },
  emptyText: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.medium as any,
    marginTop: SIZES.medium,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.medium,
    textAlign: 'center',
    marginTop: SIZES.small,
  },
});

export default CarDocumentsScreen;
