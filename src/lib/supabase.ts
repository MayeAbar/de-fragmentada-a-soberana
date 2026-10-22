import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DiaryCategory = 'finanzas' | 'cuerpo' | 'madre' | 'mujer' | 'mente';

export interface DiaryPost {
  id: string;
  category: DiaryCategory;
  title: string;
  body: string;
  image_url: string | null;
  tiktok_script: string | null;
  instagram_text: string | null;
  created_at: string;
}

export interface BookFragment {
  id: string;
  title: string;
  body: string;
  chapter_label: string | null;
  created_at: string;
}

export interface BuzonMessage {
  id: string;
  name: string;
  message: string;
  email: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface SovereigntyStat {
  id: string;
  metric_key: string;
  metric_value: string;
  updated_at: string;
}
