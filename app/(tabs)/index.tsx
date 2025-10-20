import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View, TouchableOpacity, Text, Platform, Modal, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useCars } from '../../src/hooks/useCars';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useExpenses } from '../../src/hooks/useExpenses';
import { useAuth } from '../../src/hooks/useAuth';
import { useNetwork } from '../../src/hooks/useNetwork';
import { useRecentActivity } from '../../src/hooks/useRecentActivity';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { AdaptiveContainer } from '../../components/AdaptiveContainer';
import AnimatedScreen from '../../src/components/AnimatedScreen';
import { IconSymbol } from '../../components/ui/IconSymbol';
import OfflineStatus from '../../src/components/OfflineStatus';
import UniversalFAB from '../../src/components/UniversalFAB';
import { responsiveContainers, responsiveTypography } from '../../src/styles/responsiveStyles';
import { SIZES, COLORS } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';

// Інтерфейс для структури даних останніх змін
interface BusinessUpdate {
  id: string;
  action: string;      // Вид дії (Потрачено, Продано, Конфігуровано)
  amount: string;     // Сума дії
  target: string;     // До чого виконана дія
  car: string;        // До якого авто
  performer: string;  // Хто виконав
  date: string;       // Дата
  timestamp: number;  // Часова мітка для сортування
}

export default function HomeScreen() {
  const network = useNetwork();
  const { user } = useAuth();
  const { getCars, loading: carsLoading } = useCars();
  const { getBusinessStats, loading: statsLoading } = useAnalytics();
  const { getTotalExpenses, loading: expensesLoading } = useExpenses();
  const { activities: recentActivities, loading: activitiesLoading, refresh: refreshActivities } = useRecentActivity();
  const { t, i18n } = useTranslation();
  
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      const carsData = await getCars();
      setCars(carsData || []);
      
      const statsData = await getBusinessStats();
      setStats(statsData);
      
      const expensesData = await getTotalExpenses();
      setTotalExpenses(expensesData || 0);
    };
    
    loadData();
  }, []);

  const activeCars = cars?.filter((car: any) => car.status === 'active').length || 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      getCars().then(data => setCars(data || [])),
      getBusinessStats().then(data => setStats(data)),
      getTotalExpenses().then(data => setTotalExpenses(data || 0)),
      refreshActivities()
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [getCars, getBusinessStats, getTotalExpenses, refreshActivities]);

  const navigateTo = (path: any) => {
    router.push(path);
  };

  // Дії для FAB
  const fabActions = [
    {
      title: 'Додати авто',
      icon: 'car',
      iconBg: '#1976D2',
      onPress: () => router.push('/cars/add')
    },
    {
      title: 'Оновити пробіг',
      icon: 'speedometer',
      iconBg: '#F57C00',
      onPress: () => router.push('/cars/mileage')
    },
    {
      title: 'Додати витрату',
      icon: 'card',
      iconBg: '#388E3C',
      onPress: () => router.push('/expenses/add')
    },
    {
      title: 'Додати документ',
      icon: 'document',
      iconBg: '#7B1FA2',
      onPress: () => router.push('/documents/add')
    },
    {
      title: 'Додати покупця',
      icon: 'people',
      iconBg: '#F44336',
      onPress: () => router.push('/buyers/add')
    },
    {
      title: 'Пошук',
      icon: 'search',
      iconBg: '#2196F3',
      onPress: () => router.push('/search')
    }
  ];

  return (
    <>
      <AnimatedScreen transition="slideUp" duration={400}>
        <AdaptiveContainer style={styles.container} tabletStyle={styles.container} maxWidth={800}>
          <SafeAreaView>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {network.isOffline && <OfflineStatus />}
              
              <ThemedView style={styles.header}>
                <View>
                  <ThemedText type="title">Вітаємо, {user?.user_metadata?.full_name || 'Користувач'}!</ThemedText>
                  <ThemedText type="default">Керуйте своїм автобізнесом ефективно</ThemedText>
                </View>
              </ThemedView>
              
              <ThemedText style={styles.sectionTitle} type="title">Ключові показники</ThemedText>
              
              <View style={styles.statsGrid}>
                <TouchableOpacity 
                  style={[styles.statCard, { backgroundColor: '#E3F2FD' }]} 
                  onPress={() => navigateTo('/(tabs)/explore?tab=cars')}
                >
                  <IconSymbol size={28} name="car.fill" color="#1976D2" />
                  <ThemedText style={styles.statValue}>{activeCars}</ThemedText>
                  <ThemedText style={styles.statLabel}>Активні авто</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.statCard, { backgroundColor: '#E8F5E9' }]} 
                  onPress={() => navigateTo('/(tabs)/explore?tab=profits')}
                >
                  <IconSymbol size={28} name="chart.line.uptrend.xyaxis" color="#388E3C" />
                  <ThemedText style={styles.statValue}>
                    {stats?.totalProfit && typeof stats.totalProfit === 'number' ? `${stats.totalProfit} ₴` : '0 ₴'}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Прибуток</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.statCard, { backgroundColor: '#FFF3E0' }]} 
                  onPress={() => navigateTo('/(tabs)/explore?tab=expenses')}
                >
                  <IconSymbol size={28} name="creditcard.fill" color="#F57C00" />
                  <ThemedText style={styles.statValue}>
                    {totalExpenses && typeof totalExpenses === 'number' ? `${totalExpenses} ₴` : '0 ₴'}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Витрати (місяць)</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.statCard, { backgroundColor: '#F3E5F5' }]} 
                  onPress={() => navigateTo('/(tabs)/explore?tab=buyers')}
                >
                  <IconSymbol size={28} name="person.2.fill" color="#7B1FA2" />
                  <ThemedText style={styles.statValue}>
                    {stats?.totalBuyers || 0}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Покупці</ThemedText>
                </TouchableOpacity>
              </View>
              
              <ThemedText style={styles.sectionTitle} type="title">Остання активність</ThemedText>
              
              <View style={styles.updatesContainer}>
                {activitiesLoading ? (
                  <Text style={styles.updateTitle}>Завантаження...</Text>
                ) : recentActivities.length === 0 ? (
                  <Text style={styles.updateTitle}>Поки немає активності</Text>
                ) : (
                  recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.updateItem}>
                      <Text style={styles.updateTitle}>
                        {activity.action}
                      </Text>
                      <Text style={styles.updatePerformer}>
                        {activity.description}
                      </Text>
                      <Text style={styles.updateDate}>{activity.date}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </AdaptiveContainer>
      </AnimatedScreen>

      {/* Замінюємо на універсальний FAB */}
      <UniversalFAB router={router} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  updatesContainer: {
    marginBottom: 24,
  },
  updateItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  updatePerformer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 12,
    color: '#999',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 20,
  },
  menuContent: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
} as const);
