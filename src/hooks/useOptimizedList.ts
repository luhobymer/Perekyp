import { useState, useCallback, useMemo } from 'react';

// Типи для оптимізованого списку
export interface ListItem {
  id: string | number;
  [key: string]: unknown;
}

export interface OptimizedListOptions<T extends ListItem> {
  pageSize?: number;
  initialPage?: number;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T) => boolean;
}

export const useOptimizedList = <T extends ListItem>(
  initialItems: T[] = [], 
  options: OptimizedListOptions<T> = {}
) => {
  const {
    pageSize = 20,
    initialPage = 1,
    sortBy,
    sortDirection = 'asc',
    filterFn,
  } = options;

  const [items, setItems] = useState<T[]>(initialItems);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sortedItems = useMemo(() => {
    if (!sortBy) return items;
    
    return [...items].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [items, sortBy, sortDirection]);

  const filteredItems = useMemo(() => {
    if (!filterFn) return sortedItems;
    return sortedItems.filter(filterFn);
  }, [sortedItems, filterFn]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(0, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const hasMore = useMemo(() => {
    return paginatedItems.length < filteredItems.length;
  }, [paginatedItems.length, filteredItems.length]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore, isLoading]);

  const refresh = useCallback(async (refreshFn: () => Promise<T[]>) => {
    try {
      setIsLoading(true);
      setError(null);
      const newItems = await refreshFn();
      setItems(newItems);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    items: paginatedItems,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    addItem,
    updateItem,
    removeItem,
    setItems,
  };
};

export default useOptimizedList;
