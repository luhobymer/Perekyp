import { useState } from 'react';

interface ExcelOptions {
  // Додайте опції для експорту в Excel
  [key: string]: any;
}

interface UseExcelResult {
  loading: boolean;
  error: string | null;
  exportToExcel: (data: any[], options?: ExcelOptions) => Promise<boolean>;
}

export const useExcel = (): UseExcelResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const exportToExcel = async (data: any[] = [], options: ExcelOptions = {}): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Реалізація експорту в Excel буде додана пізніше
      console.log('Експорт в Excel:', { data, options });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка експорту в Excel';
      setError(errorMessage);
      console.error('Помилка при експорті в Excel:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    exportToExcel,
  };
};

export default useExcel;
