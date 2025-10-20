export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          user_id: string
          brand: string
          model: string
          year: number
          body_type: string | null
          vin: string | null
          reg_number: string | null
          engine_type: string | null
          engine_volume: number | null
          color: string | null
          mileage: number | null
          status: string
          purchase_price: number | null
          purchase_date: string | null
          created_at: string
          updated_at: string
          description: string | null
          transmission: string | null
        }
        Insert: {
          id?: string
          user_id: string
          brand: string
          model: string
          year: number
          body_type?: string | null
          vin?: string | null
          reg_number?: string | null
          engine_type?: string | null
          engine_volume?: number | null
          color?: string | null
          mileage?: number | null
          status: string
          purchase_price?: number | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
          description?: string | null
          transmission?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          brand?: string
          model?: string
          year?: number
          body_type?: string | null
          vin?: string | null
          reg_number?: string | null
          engine_type?: string | null
          engine_volume?: number | null
          color?: string | null
          mileage?: number | null
          status?: string
          purchase_price?: number | null
          purchase_date?: string | null
          created_at?: string
          updated_at?: string
          description?: string | null
          transmission?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          car_id: string
          user_id: string
          description: string
          amount: number
          category: string
          date: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          car_id: string
          user_id: string
          description: string
          amount: number
          category: string
          date: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          user_id?: string
          description?: string
          amount?: number
          category?: string
          date?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mileage_history: {
        Row: {
          id: string
          car_id: string
          user_id: string
          value: number
          date: string
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          car_id: string
          user_id: string
          value: number
          date: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          user_id?: string
          value?: number
          date?: string
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          car_id: string
          user_id: string
          type: string
          url: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          car_id: string
          user_id: string
          type: string
          url: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          user_id?: string
          type?: string
          url?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          car_id: string
          user_id: string
          price: number
          date: string
          buyer_name: string | null
          buyer_phone: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          car_id: string
          user_id: string
          price: number
          date: string
          buyer_name?: string | null
          buyer_phone?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          user_id?: string
          price?: number
          date?: string
          buyer_name?: string | null
          buyer_phone?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
          updated_at: string
          related_id: string | null
          related_type: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          created_at?: string
          updated_at?: string
          related_id?: string | null
          related_type?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
          updated_at?: string
          related_id?: string | null
          related_type?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
