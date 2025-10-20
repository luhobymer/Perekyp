import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useExpenses, Expense } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/formatters';

// Types
type ExpenseCategory = 'all' | 'fuel' | 'service' | 'repair' | 'insurance' | 'tax' | 'other';

interface ExpensesListProps {
  carId: string;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({ carId }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('all');
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);

  const {
    data: offlineExpenses = [],
    isLoading: isOfflineLoading,
    error: offlineError,
    addItem: addOfflineExpense,
    updateItem: updateOfflineExpense,
    deleteItem: deleteOfflineExpense
  } = useOfflineStorage<Expense>('expenses');

  const {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading: isOnlineLoading,
    error: onlineError
  } = useExpenses();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const loadExpenses = useCallback(async () => {
    try {
      const expensesData = await getExpenses(carId);
      const filteredExpenses = selectedCategory === 'all' 
        ? expensesData 
        : expensesData.filter(expense => expense.expense_type === selectedCategory);
      
      setExpenses(filteredExpenses);
      setTotalAmount(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0));
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }, [carId, selectedCategory, getExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'car_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newExpense = await addExpense(carId, expenseData);
      await addOfflineExpense(newExpense);
      setExpenses(prev => [...prev, newExpense]);
      setTotalAmount(prev => prev + newExpense.amount);
      setIsAddingExpense(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleUpdateExpense = async (expenseId: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = await updateExpense(expenseId, updates);
      await updateOfflineExpense(expenseId, updates);
      
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId ? updatedExpense : expense
      ));
      
      setTotalAmount(prev => {
        const oldExpense = expenses.find(e => e.id === expenseId);
        return oldExpense ? prev - oldExpense.amount + (updates.amount || 0) : prev;
      });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      await deleteOfflineExpense(expenseId);
      
      const deletedExpense = expenses.find(e => e.id === expenseId);
      if (deletedExpense) {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
        setTotalAmount(prev => prev - deletedExpense.amount);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Categories for filtering
  const categories: { id: ExpenseCategory; label: string }[] = [
    { id: 'all', label: 'Усі' },
    { id: 'fuel', label: 'Пальне' },
    { id: 'service', label: 'Сервіс' },
    { id: 'repair', label: 'Ремонт' },
    { id: 'insurance', label: 'Страховка' },
    { id: 'tax', label: 'Податки' },
    { id: 'other', label: 'Інше' },
  ];

  // Loading state
  if (isOfflineLoading || isOnlineLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Error state
  if (offlineError || onlineError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {offlineError?.message || onlineError?.message || 'Помилка завантаження витрат'}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={loadExpenses}
        >
          <Text style={styles.retryButtonText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          Немає витрат для відображення
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setIsAddingExpense(true)}
        >
          <Text style={styles.addButtonText}>Додати витрату</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                { color: selectedCategory === category.id ? '#fff' : theme.colors.text }
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
          Загальна сума:
        </Text>
        <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
          {formatCurrency(totalAmount)}
        </Text>
      </View>

      {/* Expenses List */}
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.expenseItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.expenseInfo}>
              <Text style={[styles.expenseType, { color: theme.colors.primary }]}>
                {categories.find(c => c.id === item.expense_type)?.label || item.expense_type}
              </Text>
              <Text style={[styles.expenseDate, { color: theme.colors.textSecondary }]}>
                {formatDate(item.date)}
              </Text>
            </View>
            <Text style={[styles.expenseAmount, { color: theme.colors.text }]}>
              {formatCurrency(item.amount)}
            </Text>
            {item.description && (
              <Text style={[styles.expenseDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
              </Text>
            )}
            <View style={styles.expenseActions}>
              <TouchableOpacity onPress={() => handleUpdateExpense(item.id, { ...item })}>
                <Text style={{ color: theme.colors.primary }}>Редагувати</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                <Text style={{ color: theme.colors.error }}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Expense Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsAddingExpense(true)}
      >
        <Text style={styles.addButtonText}>Додати витрату</Text>
      </TouchableOpacity>

      {/* Add/Edit Expense Modal */}
      {/* TODO: Implement modal for adding/editing expenses */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  expenseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseType: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
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

export default ExpensesList;
