import { supabase } from '../utils/supabase';

// Інтерфейси для типізації інвестицій
interface Investment {
  id: string;
  car_id: string;
  user_id: string;
  type: string;
  amount: number;
  date: string;
  description?: string;
  receipt_url?: string;
  created_at: string;
  updated_at?: string;
}

interface InvestmentWithCar extends Investment {
  cars: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
}

interface InvestmentData extends Omit<Investment, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

interface InvestmentSummary {
  [key: string]: number;
}

// Сервіс для роботи з вкладеннями
const investmentService = {
  // Отримання всіх вкладень для автомобіля
  getInvestmentsByCar: async (carId: string): Promise<Investment[]> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('car_id', carId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching investments:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Отримання всіх вкладень користувача
  getAllInvestments: async (userId: string): Promise<InvestmentWithCar[]> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          cars (
            id,
            brand,
            model,
            year
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all investments:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Створення нового вкладення
  createInvestment: async (investmentData: InvestmentData): Promise<Investment> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert([investmentData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating investment:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Оновлення вкладення
  updateInvestment: async (investmentId: string, investmentData: Partial<InvestmentData>): Promise<Investment> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .update(investmentData)
        .eq('id', investmentId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating investment:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Видалення вкладення
  deleteInvestment: async (investmentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', investmentId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting investment:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Отримання сум вкладень за категоріями для автомобіля
  getInvestmentSummaryByCar: async (carId: string): Promise<InvestmentSummary> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('type, amount')
        .eq('car_id', carId);
      
      if (error) throw error;
      
      // Підрахунок сум за категоріями
      const summary = data.reduce<InvestmentSummary>((acc, item) => {
        const type = item.type;
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += parseFloat(String(item.amount));
        return acc;
      }, {});
      
      return summary;
    } catch (error) {
      console.error('Error getting investment summary:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },
  
  // Загальна сума вкладень для автомобіля
  getTotalInvestmentByCar: async (carId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('amount')
        .eq('car_id', carId);
      
      if (error) throw error;
      
      const total = data.reduce((sum, item) => sum + parseFloat(String(item.amount)), 0);
      return total;
    } catch (error) {
      console.error('Error getting total investment:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  },

  // Додавання чека/рахунку до вкладення
  uploadInvestmentReceipt: async (investmentId: string, uri: string, fileName: string): Promise<string> => {
    try {
      const fileExt = fileName.split('.').pop() || 'jpg';
      const filePath = `investments/${investmentId}/${new Date().getTime()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('investment_receipts')
        .upload(filePath, {
          uri: uri,
          type: `image/${fileExt}`,
          name: fileName
        });
      
      if (uploadError) throw uploadError;
      
      const { data: receiptUrl } = supabase.storage
        .from('investment_receipts')
        .getPublicUrl(filePath);
      
      // Оновлення вкладення з посиланням на чек
      const { error: updateError } = await supabase
        .from('investments')
        .update({ receipt_url: receiptUrl.publicUrl })
        .eq('id', investmentId);
      
      if (updateError) throw updateError;
      
      return receiptUrl.publicUrl;
    } catch (error) {
      console.error('Error uploading receipt:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
};

export default investmentService;
