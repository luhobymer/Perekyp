import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
// Типи документів імпортуються з common.ts
import { DocumentType } from '../../types/components/common';
import { 
  DocumentFormData, 
  DocumentFormValidation, 
  AddEditDocumentScreenProps 
} from '../../types/screens/addEditDocument';
import { useDocuments } from '../../hooks/useDocuments';

// Типи документів для авто
const DOCUMENT_TYPES: { id: DocumentType; icon: string }[] = [
  { id: 'registration', icon: 'document-text-outline' },
  { id: 'insurance', icon: 'shield-checkmark-outline' },
  { id: 'purchase', icon: 'receipt-outline' },
  { id: 'maintenance', icon: 'build-outline' },
  { id: 'inspection', icon: 'clipboard-outline' },
  { id: 'other', icon: 'document-outline' }
];



const AddEditDocumentScreen: React.FC<AddEditDocumentScreenProps> = ({ route, navigation }) => {
  const { carId, documentId, documentType } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { getDocument, addDocument, updateDocument } = useDocuments();
  
  const isEditing = !!documentId;
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Стан для полів форми
  const [formData, setFormData] = useState<DocumentFormData>({
    type: documentType || 'other',
    title: '',
    description: '',
    number: '',
    date: new Date(),
    expiryDate: null,
    file: null
  });
  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<DocumentFormValidation['errors']>({});
  
  // Завантаження документа для редагування
  useEffect(() => {
    const loadDocument = async () => {
      if (documentId) {
        try {
          setLoading(true);
          const document = await getDocument(documentId.toString()) as unknown as {
            id: string;
            carId: string;
            type: DocumentType;
            title: string;
            description?: string;
            number?: string;
            date: string | Date;
            expiryDate?: string | Date;
            file?: {
              url: string;
              name: string;
              type: string;
              size: number;
            };
            createdAt: Date;
            updatedAt: Date;
          };
          if (document) {
            setFormData({
              type: document.type,
              title: document.title,
              description: document.description || '',
              number: document.number || '',
              date: new Date(document.date),
              expiryDate: document.expiryDate ? new Date(document.expiryDate) : null,
              file: document.file ? {
                uri: document.file.url,
                name: document.file.name,
                type: document.file.type,
                size: document.file.size
              } : null
            });
          }
        } catch (error) {
          console.error('Error loading document:', error);
          Alert.alert(
            t('error'),
            t('error_loading_document')
          );
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadDocument();
  }, [documentId, getDocument, t]);
  
  // Функція для перекладу типу документа
  const getDocumentTypeLabel = useCallback((type: DocumentType): string => {
    switch (type) {
      case 'registration':
        return t('document_type_registration');
      case 'insurance':
        return t('document_type_insurance');
      case 'purchase':
        return t('document_type_purchase');
      case 'maintenance':
        return t('document_type_maintenance');
      case 'inspection':
        return t('document_type_inspection');
      case 'other':
        return t('document_type_other');
      default:
        return type;
    }
  }, [t]);
  
  // Обробка зміни дати
  const handleDateChange = useCallback((_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({ ...prev, date: currentDate }));
  }, [formData.date]);
  
  // Обробка зміни терміну дії
  const handleExpiryDateChange = useCallback((_: any, selectedDate?: Date) => {
    setShowExpiryDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({ ...prev, expiryDate: selectedDate || null }));
  }, []);
  
  // Форматування дати для відображення
  const formatDate = useCallback((date: Date): string => {
    return format(date, 'd MMMM yyyy', { locale: uk });
  }, []);
  
  // Вибір файлу документа
  const pickDocument = useCallback(async () => {
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
      const fileSize = (fileInfo as any).size || 0;
      if (fileSize > 10 * 1024 * 1024) {
        Alert.alert(
          t('error'),
          t('file_size_limit')
        );
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: (fileInfo as any).size || 0
        }
      }));
      
      setErrors(prev => ({ ...prev, file: undefined }));
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        t('error'),
        t('error_picking_document')
      );
    }
  }, [t]);
  
  // Валідація форми
  const validateForm = useCallback((): boolean => {
    const newErrors: DocumentFormValidation['errors'] = {};
    
    if (!formData.type) {
      newErrors.type = t('error_document_type_required');
    }
    
    if (!formData.title.trim()) {
      newErrors.title = t('error_document_title_required');
    }
    
    if (!formData.date) {
      newErrors.date = t('error_document_date_required');
    }
    
    if (!isEditing && !formData.file) {
      newErrors.file = t('error_document_file_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditing, t]);
  
  // Збереження документа
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      if (isEditing && documentId) {
        await updateDocument(documentId.toString(), {
          title: formData.title,
          description: formData.description,
          date: formData.date.toISOString(),
          // Додаткові поля передаємо через додатковий об'єкт
          ...({
            type: formData.type,
            number: formData.number,
            expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : null,
            file: formData.file ? {
              uri: formData.file.uri,
              name: formData.file.name,
              type: formData.file.type,
              size: formData.file.size
            } : undefined
          } as any)
        });
        
        Alert.alert(
          t('success'),
          t('document_updated_successfully'),
          [{ text: t('ok'), onPress: () => navigation.goBack() }]
        );
      } else {
        await addDocument(carId.toString(), {
          title: formData.title,
          description: formData.description,
          date: formData.date.toISOString(),
          // Додаткові поля передаємо через додатковий об'єкт
          ...({
            type: formData.type,
            number: formData.number,
            expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : null,
            file: formData.file ? {
              uri: formData.file.uri,
              name: formData.file.name,
              type: formData.file.type,
              size: formData.file.size
            } : undefined
          } as any)
        });
        
        Alert.alert(
          t('success'),
          t('document_added_successfully'),
          [{ text: t('ok'), onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert(
        t('error'),
        isEditing ? t('error_updating_document') : t('error_adding_document')
      );
    } finally {
      setSaving(false);
    }
  }, [formData, isEditing, documentId, carId, validateForm, updateDocument, addDocument, navigation, t]);
  
  // Скасування та повернення назад
  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  // Рендер списку типів документів
  const renderDocumentTypes = useCallback(() => {
    return (
      <View style={styles.documentTypesContainer}>
        {DOCUMENT_TYPES.map((docType) => (
          <TouchableOpacity
            key={docType.id}
            style={[
              styles.documentTypeItem,
              { 
                backgroundColor: formData.type === docType.id 
                  ? theme.colors.primary 
                  : theme.colors.card,
                borderColor: formData.type === docType.id 
                  ? theme.colors.primary 
                  : theme.colors.border
              }
            ]}
            onPress={() => {
              setFormData(prev => ({ ...prev, type: docType.id }));
              setErrors(prev => ({ ...prev, type: undefined }));
            }}
          >
            <Ionicons
              name={docType.icon as any}
              size={24}
              color={formData.type === docType.id ? '#FFFFFF' : theme.colors.text}
            />
            <Text
              style={[
                styles.documentTypeText,
                { 
                  color: formData.type === docType.id 
                    ? '#FFFFFF' 
                    : theme.colors.text 
                }
              ]}
            >
              {getDocumentTypeLabel(docType.id)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [formData.type, getDocumentTypeLabel, theme.colors]);
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t('loading_document')}
        </Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
            {isEditing ? t('edit_document') : t('add_document')}
          </Text>
        </View>
        
        {/* Тип документа */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_type')}
          </Text>
          {renderDocumentTypes()}
          {errors.type && (
            <Text style={styles.errorText}>{errors.type}</Text>
          )}
        </View>
        
        {/* Назва документа */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_title')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: errors.title ? theme.colors.error : theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text
              }
            ]}
            placeholder={t('document_title_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.title}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, title: text }));
              setErrors(prev => ({ ...prev, title: undefined }));
            }}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>
        
        {/* Номер документа */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_number')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                borderColor: errors.number ? theme.colors.error : theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text
              }
            ]}
            placeholder={t('document_number_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.number}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, number: text }));
              setErrors(prev => ({ ...prev, number: undefined }));
            }}
          />
          {errors.number && (
            <Text style={styles.errorText}>{errors.number}</Text>
          )}
        </View>
        
        {/* Дата видачі */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_date')}
          </Text>
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              { 
                borderColor: errors.date ? theme.colors.error : theme.colors.border,
                backgroundColor: theme.colors.card
              }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {formatDate(formData.date)}
            </Text>
          </TouchableOpacity>
          {errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
        
        {/* Термін дії */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_expiry_date')}
          </Text>
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              { 
                borderColor: errors.expiryDate ? theme.colors.error : theme.colors.border,
                backgroundColor: theme.colors.card
              }
            ]}
            onPress={() => setShowExpiryDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {formData.expiryDate ? formatDate(formData.expiryDate) : t('no_expiry_date')}
            </Text>
          </TouchableOpacity>
          {errors.expiryDate && (
            <Text style={styles.errorText}>{errors.expiryDate}</Text>
          )}
          {showExpiryDatePicker && (
            <DateTimePicker
              value={formData.expiryDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleExpiryDateChange}
            />
          )}
        </View>
        
        {/* Опис */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_description')}
          </Text>
          <TextInput
            style={[
              styles.noteInput,
              { 
                borderColor: errors.description ? theme.colors.error : theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                textAlignVertical: 'top'
              }
            ]}
            placeholder={t('document_description_placeholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.description}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, description: text }));
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            multiline
            numberOfLines={4}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>
        
        {/* Файл документа */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('document_file')}
          </Text>
          
          {formData.file ? (
            <View style={styles.fileContainer}>
              <View style={styles.fileInfo}>
                <Ionicons 
                  name={formData.file.type.includes('pdf') ? 'document-outline' : 'image-outline'} 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <View style={styles.fileDetails}>
                  <Text style={[styles.fileName, { color: theme.colors.text }]}>
                    {formData.file.name}
                  </Text>
                  <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>
                    {(formData.file.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeFileButton}
                onPress={() => setFormData(prev => ({ ...prev, file: null }))}
              >
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.filePickerButton,
                { 
                  borderColor: errors.file ? theme.colors.error : theme.colors.border,
                  backgroundColor: theme.colors.card
                }
              ]}
              onPress={pickDocument}
            >
              <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.filePickerText, { color: theme.colors.text }]}>
                {t('select_document_file')}
              </Text>
            </TouchableOpacity>
          )}
          
          {errors.file && (
            <Text style={styles.errorText}>{errors.file}</Text>
          )}
        </View>
        
        {/* Кнопки дій */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.cancelButton, 
              { borderColor: theme.colors.border }
            ]}
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.saveButton, 
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {isEditing ? t('update') : t('save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.medium,
  },
  header: {
    marginBottom: SIZES.medium,
  },
  screenTitle: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold as any,
  },
  formGroup: {
    marginBottom: SIZES.large,
  },
  label: {
    fontSize: FONTS.sizes.small,
    marginBottom: SIZES.xsmall,
    fontWeight: FONTS.weights.medium as any,
  },
  input: {
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    fontSize: FONTS.sizes.medium,
  },
  documentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.xsmall,
  },
  documentTypeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: SIZES.small,
    borderWidth: 1,
    padding: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
  },
  documentTypeText: {
    fontSize: FONTS.sizes.small,
    textAlign: 'center',
    marginTop: SIZES.small,
  },
  datePickerButton: {
    height: 48,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FONTS.sizes.medium,
    marginLeft: SIZES.small,
  },
  noteInput: {
    height: 100,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontSize: FONTS.sizes.medium,
  },
  filePickerButton: {
    height: 60,
    borderRadius: SIZES.xsmall,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePickerText: {
    fontSize: FONTS.sizes.medium,
    marginLeft: SIZES.small,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.small,
    borderWidth: 1,
    borderRadius: SIZES.xsmall,
    borderColor: '#E0E0E0',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: SIZES.small,
    flex: 1,
  },
  fileName: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium as any,
  },
  fileSize: {
    fontSize: FONTS.sizes.xsmall,
  },
  removeFileButton: {
    padding: SIZES.xxs,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.large,
  },
  button: {
    width: '48%',
    height: 48,
    borderRadius: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: FONTS.sizes.medium,
    fontWeight: FONTS.weights.medium as any,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: FONTS.sizes.small,
    marginTop: SIZES.xxs,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: FONTS.sizes.medium,
  },
});

export default AddEditDocumentScreen;
