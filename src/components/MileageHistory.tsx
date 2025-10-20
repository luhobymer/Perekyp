import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useMileage } from '../hooks/useMileage';
import { formatDate, formatNumber } from '../utils/formatters';

type Theme = {
  colors: {
    primary: string;
    text: string;
    textSecondary: string;
    card: string;
    background: string;
    error: string;
  };
};

// Локальний тип для статусу синхронізації
type SyncStatus = 'pending' | 'synced' | 'error';

// Типи
interface MileageHistoryProps {
  carId: string;
}

type BaseMileageRecord = {
  id: string;
  car_id: string;
  value: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

type MileageRecord = BaseMileageRecord & {
  syncStatus: SyncStatus;
};

type MileageWithCarType = BaseMileageRecord & {
  cars?: {
    id: string;
    name: string;
  };
};

type MileageEntry = MileageRecord | MileageWithCarType;

export const MileageHistory: React.FC<MileageHistoryProps> = ({ carId }) => {
  const { theme } = useTheme() as { theme: Theme };
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [records, setRecords] = useState<MileageEntry[]>([]);
  const [totalMileage, setTotalMileage] = useState<number>(0);
  const [averageMileage, setAverageMileage] = useState<number>(0);
  
  // Використовуємо змінну, щоб уникнути попередження про невикористання
  const handleAddClick = useCallback(() => {
    setIsAddingRecord(true);
  }, []);
  
  // Мемоізована функція для рендерингу записів
  const renderItem = useCallback(({ item }: { item: MileageEntry }) => {
    // Перевіряємо, чи є у записі дані про автомобіль
    const carName = 'cars' in item && item.cars ? item.cars.name : 'Невідомий автомобіль';
    
    return (
      <View style={[styles.recordItem, { backgroundColor: theme.colors.card }]}>
        <View style={styles.recordHeader}>
          <Text style={[styles.recordTitle, { color: theme.colors.text }]}>
            {formatNumber(item.value)} км
          </Text>
          <Text style={[styles.recordDate, { color: theme.colors.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        {item.notes && (
          <Text style={[styles.recordNotes, { color: theme.colors.text }]}>
            {item.notes}
          </Text>
        )}
        <Text style={[styles.recordCar, { color: theme.colors.primary }]}>
          {carName}
        </Text>
        <View style={styles.recordActions}>
          <TouchableOpacity 
            onPress={() => handleUpdateRecord(item.id, { notes: 'Оновлений запис' })}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.actionButtonText}>Редагувати</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDeleteRecord(item.id)}
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          >
            <Text style={styles.actionButtonText}>Видалити</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [theme]);

  const {
    getMileageHistory,
    addMileageRecord,
    updateMileageRecord,
    deleteMileageRecord,
    loading: isOnlineLoading,
    error: onlineError
  } = useMileage();
  
  const {
    data: offlineRecords = [],
    loading: isOfflineLoading,
    error: offlineError,
    addItem: addOfflineRecord,
    updateItem: updateOfflineRecord,
    deleteItem: deleteOfflineRecord
  } = useOfflineStorage<MileageRecord>('mileage_history');
  
  // Використовуємо offlineRecords для відображення даних
  useEffect(() => {
    if (offlineRecords.length > 0) {
      setRecords(offlineRecords);
    }
  }, [offlineRecords]);

  const loadMileageHistory = useCallback(async () => {
    try {
      const historyData = await getMileageHistory(carId);
      // Приводимо тип до нашого локального типу
      const typedData: MileageEntry[] = historyData.map(item => ({
        ...item,
        syncStatus: 'synced' as const
      }));
      
      setRecords(typedData);
      
      if (typedData.length > 0) {
        const total = typedData.reduce((sum, record) => sum + record.value, 0);
        setTotalMileage(total);
        setAverageMileage(total / typedData.length);
      }
    } catch (error) {
      console.error('Error loading mileage history:', error);
    }
  }, [carId, getMileageHistory]);

  useEffect(() => {
    loadMileageHistory();
  }, [loadMileageHistory]);

  // Функція для додавання запису про пробіг
  const handleAddRecord = useCallback(async (recordData: Omit<BaseMileageRecord, 'id' | 'car_id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const newRecord = await addMileageRecord(carId, recordData);
      
      if (!newRecord) {
        throw new Error('Не вдалося створити запис');
      }

      const offlineRecord: MileageRecord = {
        ...newRecord,
        syncStatus: 'synced' as const
      };
      
      await addOfflineRecord(offlineRecord);
      
      setRecords(prev => {
        const updatedRecords = [...prev, { ...offlineRecord }];
        const newTotal = updatedRecords.reduce((sum, r) => sum + r.value, 0);
        setTotalMileage(newTotal);
        setAverageMileage(newTotal / updatedRecords.length);
        return updatedRecords;
      });
      
      setIsAddingRecord(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Сталася невідома помилка';
      setError(`Помилка при додаванні запису: ${errorMessage}`);
      console.error('Error adding mileage record:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [addMileageRecord, addOfflineRecord, carId]);

  const handleUpdateRecord = useCallback(async (recordId: string, updates: Partial<BaseMileageRecord>) => {
    try {
      const updatedRecord = await updateMileageRecord(recordId, updates);
      
      if (!updatedRecord) {
        throw new Error('Не вдалося оновити запис');
      }

      await updateOfflineRecord(recordId, updates);
      
      setRecords(prev => {
        const updatedRecords = prev.map(record => 
          record.id === recordId ? { ...record, ...updates } : record
        ) as MileageEntry[];
        const newTotal = updatedRecords.reduce((sum, r) => sum + r.value, 0);
        setTotalMileage(newTotal);
        setAverageMileage(updatedRecords.length > 0 ? newTotal / updatedRecords.length : 0);
        return updatedRecords;
      });
    } catch (error) {
      console.error('Error updating mileage record:', error);
      setError('Помилка при оновленні запису');
    }
  }, [updateMileageRecord, updateOfflineRecord]);

  const handleDeleteRecord = useCallback(async (recordId: string) => {
    try {
      await deleteMileageRecord(recordId);
      await deleteOfflineRecord(recordId);
      
      setRecords(prev => {
        const updatedRecords = prev.filter(record => record.id !== recordId);
        const newTotal = updatedRecords.reduce((sum, r) => sum + r.value, 0);
        setTotalMileage(newTotal);
        setAverageMileage(updatedRecords.length > 0 ? newTotal / updatedRecords.length : 0);
        return updatedRecords;
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      console.error('Error deleting mileage record:', error);
      setError(`Помилка при видаленні запису: ${errorMessage}`);
    }
  }, [deleteMileageRecord, deleteOfflineRecord]);

  // Loading state
  if (isOfflineLoading || isOnlineLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Завантаження історії пробігу...
        </Text>
      </View>
    );
  }

  // Error state
  if (offlineError || onlineError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {offlineError?.toString() || onlineError?.toString() || 'Помилка завантаження історії пробігу'}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={loadMileageHistory}
        >
          <Text style={styles.retryButtonText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (records.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          Немає записів про пробіг
        </Text>
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
        <TouchableOpacity 
          style={[
            styles.addButton, 
            { 
              backgroundColor: theme.colors.primary,
              opacity: isProcessing ? 0.6 : 1
            }
          ]}
          onPress={() => {
            // Додаємо тестові дані для демонстрації
            handleAddRecord({
              value: 1000,
              date: new Date().toISOString(),
              notes: 'Тестовий запис про пробіг'
            });
          }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text style={styles.addButtonText}>Додати тестовий запис</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // Мемоізований рендеринг статистики
  const stats = useMemo(() => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Всього записів:
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {records.length}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Загальний пробіг:
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {formatNumber(totalMileage)} км
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Середній пробіг:
        </Text>
        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
          {formatNumber(averageMileage)} км
        </Text>
      </View>
    </View>
  ), [records.length, totalMileage, averageMileage, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {stats}

      {/* Records List */}
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Record Button */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddClick}
        disabled={isProcessing}
      >
        <Text style={styles.addButtonText}>
          {isProcessing ? 'Обробка...' : 'Додати запис'}
        </Text>
      </TouchableOpacity>

      {/* Add/Edit Record Modal */}
      {isAddingRecord && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Додати новий запис про пробіг
            </Text>
            {/* TODO: Implement form for adding new mileage record */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                onPress={() => setIsAddingRecord(false)}
              >
                <Text style={styles.modalButtonText}>Скасувати</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Loading Indicator */}
      {(isOfflineLoading || isOnlineLoading) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 235, 235, 0.8)',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF3B30',
    fontSize: 14,
  },
  recordItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordMileage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  recordNotes: {
    fontSize: 14,
    marginBottom: 12,
    color: '#444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  recordCar: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#666',
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MileageHistory;
