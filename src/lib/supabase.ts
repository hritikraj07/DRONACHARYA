// Supabase Client Initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hdsrrzlzehoqllmxomyo.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Tg5rvQistURWJvDjGCY5og_RoKgu1yX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
