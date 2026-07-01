import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://TU_URL.supabase.co"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const productsTable =
  process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE ?? process.env.SUPABASE_PRODUCTS_TABLE ?? "productos";