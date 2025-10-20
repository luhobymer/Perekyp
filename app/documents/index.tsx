import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import SafeAreaView from '../../components/SafeAreaView';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
import AnimatedScreen from '../../components/AnimatedScreen';
import { Ionicons } from '@expo/vector-icons';

// Тимчасові дані для прикладу
const MOCK_DOCUMENTS = [
  { id: '1', name: 'Технічний паспорт BMW X5', date: '12.03.2023', type: 'passport' },
  { id: '2', name: 'Страховка Audi A6', date: '05.01.2023', type: 'insurance' },
  { id: '3', name: 'Договір купівлі-продажу Mercedes C200', date: '22.04.2023', type: 'contract' },
  { id: '4', name: 'Акт передачі Toyota Camry', date: '18.05.2023', type: 'act' },
];

export default function DocumentsScreen() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport':
        return 'document-text';
      case 'insurance':
        return 'shield-checkmark';
      case 'contract':
        return 'create';
      case 'act':
        return 'clipboard';
      default:
        return 'document';
    }
  };

  const renderDocumentItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.documentItem}>
      <View style={styles.documentIconContainer}>
        <Ionicons name={getDocumentIcon(item.type)} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentDate}>{item.date}</Text>
      </View>
      <TouchableOpacity style={styles.documentAction}>
        <Ionicons name="ellipsis-vertical" size={20} color="#6C757D" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <AnimatedScreen transition="slideRight" duration={400}>
        <Stack.Screen
          options={{
            title: t('documents.title', 'Документи'),
            headerShown: true,
          }}
        />
        <View style={styles.container}>
          <FlatList
            data={documents}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text" size={64} color="#CED4DA" />
                <Text style={styles.emptyText}>
                  {t('documents.noDocuments', 'Немає документів')}
                </Text>
              </View>
            }
          />
        </View>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: SIZES.medium,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#6C757D',
  },
  documentAction: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});
