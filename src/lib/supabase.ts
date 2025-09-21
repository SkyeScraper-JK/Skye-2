import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          email: string;
          password: string;
          role: string;
          phone: string | null;
          status: string;
          created_at: string | null;
        };
        Insert: {
          name: string;
          email: string;
          password: string;
          role?: string;
          phone?: string | null;
          status?: string;
        };
        Update: {
          name?: string;
          email?: string;
          password?: string;
          role?: string;
          phone?: string | null;
          status?: string;
        };
      };
      projects: {
        Row: {
          id: number;
          developer_id: number;
          name: string;
          description: string | null;
          location: string;
          created_at: string | null;
          updated_at: string | null;
          brochure_url: string | null;
          unit_excel_url: string | null;
          created_by: number | null;
        };
        Insert: {
          developer_id: number;
          name: string;
          description?: string | null;
          location: string;
          brochure_url?: string | null;
          unit_excel_url?: string | null;
          created_by?: number | null;
        };
        Update: {
          developer_id?: number;
          name?: string;
          description?: string | null;
          location?: string;
          brochure_url?: string | null;
          unit_excel_url?: string | null;
          created_by?: number | null;
        };
      };
      units: {
        Row: {
          id: number;
          project_id: number;
          name: string;
          type: string;
          price: number;
          status: string;
          created_at: string | null;
          updated_at: string | null;
          discount_price: number | null;
          registration_fee: number | null;
          roi_percentage: number | null;
          payment_plan: string | null;
        };
        Insert: {
          project_id: number;
          name: string;
          type?: string;
          price: number;
          status?: string;
          discount_price?: number | null;
          registration_fee?: number | null;
          roi_percentage?: number | null;
          payment_plan?: string | null;
        };
        Update: {
          project_id?: number;
          name?: string;
          type?: string;
          price?: number;
          status?: string;
          discount_price?: number | null;
          registration_fee?: number | null;
          roi_percentage?: number | null;
          payment_plan?: string | null;
        };
      };
      upload_logs: {
        Row: {
          id: number;
          project_id: number | null;
          uploaded_by: number;
          file_url: string;
          file_type: string;
          status: string | null;
          errors: string | null;
          created_at: string | null;
        };
        Insert: {
          project_id?: number | null;
          uploaded_by: number;
          file_url: string;
          file_type: string;
          status?: string | null;
          errors?: string | null;
        };
        Update: {
          project_id?: number | null;
          uploaded_by?: number;
          file_url?: string;
          file_type?: string;
          status?: string | null;
          errors?: string | null;
        };
      };
    };
  };
}