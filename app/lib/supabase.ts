import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Memory {
  id: string;
  title: string;
  description: string;
  category: 'Memory' | 'Activity';
  images: string[];
  is_black_white: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemoryInsert {
  title: string;
  description: string;
  category: 'Memory' | 'Activity';
  images: string[];
  is_black_white: boolean;
}
