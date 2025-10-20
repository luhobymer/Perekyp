import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { COLORS, SIZES } from '../src/constants/theme';
import { useTranslation } from 'react-i18next';
import AnimatedScreen from '../src/components/AnimatedScreen';
import { Ionicons } from '@expo/vector-icons';

// Тимчасові дані для прикладу
const MOCK_DATA = {
  cars: [
    { id: 'car1', type: 'car', title: 'BMW X5 2019', subtitle: 'Чорний, 3.0 дизель' },
    { id: 'car2', type: 'car', title: 'Audi A6 2020', subtitle: 'Сірий, 2.0 бензин' },
    { id: 'car3', type: 'car', title: 'Mercedes C200 2018', subtitle: 'Білий, 1.8 бензин' },
  ],
  expenses: [
    { id: 'exp1', type: 'expense', title: 'Заміна масла', subtitle: '1500 грн, BMW X5' },
    { id: 'exp2', type: 'expense', title: 'Нові шини', subtitle: '12000 грн, Audi A6' },
  ],
  buyers: [
    { id: 'buyer1', type: 'buyer', title: 'Олександр Петренко', subtitle: '+380501234567' },
    { id: 'buyer2', type: 'buyer', title: 'Марія Коваленко', subtitle: '+380672345678' },
  ],
  documents: [
    { id: 'doc1', type: 'document', title: 'Технічний паспорт BMW X5', subtitle: '12.03.2023' },
    { id: 'doc2', type: 'document', title: 'Страховка Audi A6', subtitle: '05.01.2023' },
  ],
};

export default function SearchScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    let results = [];

    // Фільтруємо результати відповідно до активної вкладки
    if (activeTab === 'all' || activeTab === 'cars') {
      const filteredCars = MOCK_DATA.cars.filter(
        item => item.title.toLowerCase().includes(lowerQuery) || item.subtitle.toLowerCase().includes(lowerQuery)
      );
      results = [...results, ...filteredCars];
    }

    if (activeTab === 'all' || activeTab === 'expenses') {
      const filteredExpenses = MOCK_DATA.expenses.filter(
        item => item.title.toLowerCase().includes(lowerQuery) || item.subtitle.toLowerCase().includes(lowerQuery)
      );
      results = [...results, ...filteredExpenses];
    }

    if (activeTab === 'all' || activeTab === 'buyers') {
      const filteredBuyers = MOCK_DATA.buyers.filter(
        item => item.title.toLowerCase().includes(lowerQuery) || item.subtitle.toLowerCase().includes(lowerQuery)
      );
      results = [...results, ...filteredBuyers];
    }

    if (activeTab === 'all' || activeTab === 'documents') {
      const filteredDocuments = MOCK_DATA.documents.filter(
        item => item.title.toLowerCase().includes(lowerQuery) || item.subtitle.toLowerCase().includes(lowerQuery)
      );
      results = [...results, ...filteredDocuments];
    }

    setSearchResults(results);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    performSearch(text);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    performSearch(searchQuery);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'car':
        return 'car';
      case 'expense':
        return 'cash';
      case 'buyer':
        return 'person';
      case 'document':
        return 'document-text';
      default:
        return 'search';
    }
  };

  const handleItemPress = (item: any) => {
    switch (item.type) {
      case 'car':
        router.push(`/cars/${item.id.replace('car', '')}`);
        break;
      case 'expense':
        router.push(`/expenses/${item.id.replace('exp', '')}`);
        break;
      case 'buyer':
        router.push(`/buyers/${item.id.replace('buyer', '')}`);
        break;
      case 'document':
        router.push(`/documents/${item.id.replace('doc', '')}`);
        break;
    }
  };

  const renderSearchItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.searchItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getItemColor(item.type) }]}>
        <Ionicons name={getIconForType(item.type)} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
    </TouchableOpacity>
  );

  const getItemColor = (type: string) => {
    switch (type) {
      case 'car':
        return '#3498db';
      case 'expense':
        return '#2ecc71';
      case 'buyer':
        return '#9b59b6';
      case 'document':
        return '#f39c12';
      default:
        return COLORS.primary;
    }
  };

  return (
    <AnimatedScreen>
      <Stack.Screen
        options={{
          title: t('search.title', 'Пошук'),
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6C757D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search.placeholder', 'Пошук авто, витрат, покупців...')}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#6C757D" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
            onPress={() => handleTabChange('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              {t('search.all', 'Всі')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'cars' && styles.activeTab]} 
            onPress={() => handleTabChange('cars')}
          >
            <Text style={[styles.tabText, activeTab === 'cars' && styles.activeTabText]}>
              {t('search.cars', 'Авто')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expenses' && styles.activeTab]} 
            onPress={() => handleTabChange('expenses')}
          >
            <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
              {t('search.expenses', 'Витрати')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'buyers' && styles.activeTab]} 
            onPress={() => handleTabChange('buyers')}
          >
            <Text style={[styles.tabText, activeTab === 'buyers' && styles.activeTabText]}>
              {t('search.buyers', 'Покупці')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'documents' && styles.activeTab]} 
            onPress={() => handleTabChange('documents')}
          >
            <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
              {t('search.documents', 'Документи')}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {searchQuery ? (
                <>
                  <Ionicons name="search" size={64} color="#CED4DA" />
                  <Text style={styles.emptyText}>{t('search.noResults', 'Немає результатів')}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="search" size={64} color="#CED4DA" />
                  <Text style={styles.emptyText}>{t('search.startTyping', 'Почніть вводити для пошуку')}</Text>
                </>
              )}
            </View>
          }
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.small,
    margin: SIZES.medium,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  tabsContainer: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: SIZES.medium,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: '#6C757D',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: SIZES.medium,
  },
  searchItem: {
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6C757D',
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
