import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import SafeAreaView from '../../components/SafeAreaView';
import { COLORS, SIZES } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
import AnimatedScreen from '../../components/AnimatedScreen';
import { Ionicons } from '@expo/vector-icons';

// Тимчасові дані для прикладу
const MOCK_BUYERS = [
  { id: '1', name: 'Олександр Петренко', phone: '+380501234567', email: 'alex.petrenko@gmail.com' },
  { id: '2', name: 'Марія Коваленко', phone: '+380672345678', email: 'maria.kovalenko@gmail.com' },
  { id: '3', name: 'Іван Сидоренко', phone: '+380633456789', email: 'ivan.sydorenko@gmail.com' },
  { id: '4', name: 'Наталія Шевченко', phone: '+380994567890', email: 'natalia.shevchenko@gmail.com' },
];

export default function BuyersScreen() {
  const { t } = useTranslation();
  const [buyers, setBuyers] = useState(MOCK_BUYERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuyers = searchQuery
    ? buyers.filter(buyer => 
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.phone.includes(searchQuery) ||
        buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : buyers;

  const renderBuyerItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.buyerItem}
      onPress={() => {
        // Навігація до деталей покупця (буде реалізовано пізніше)
        // router.push(`/buyers/${item.id}`);
      }}
    >
      <View style={styles.buyerAvatar}>
        <Text style={styles.buyerInitials}>
          {item.name.split(' ').map((n: string) => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.buyerInfo}>
        <Text style={styles.buyerName}>{item.name}</Text>
        <Text style={styles.buyerContact}>{item.phone}</Text>
        <Text style={styles.buyerContact}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.buyerAction}>
        <Ionicons name="chevron-forward" size={20} color="#6C757D" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <AnimatedScreen transition="slideRight" duration={400}>
        <Stack.Screen
          options={{
            title: t('buyers.title', 'Покупці'),
            headerShown: true,
          }}
        />
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6C757D" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('buyers.search', 'Пошук покупців')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#6C757D" />
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={filteredBuyers}
            renderItem={renderBuyerItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={64} color="#CED4DA" />
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? t('buyers.noSearchResults', 'Немає результатів пошуку')
                    : t('buyers.noBuyers', 'Немає покупців')}
                </Text>
              </View>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/buyers/add')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
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
  listContent: {
    padding: SIZES.medium,
    paddingTop: 0,
  },
  buyerItem: {
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
  buyerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buyerInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  buyerContact: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  buyerAction: {
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
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
