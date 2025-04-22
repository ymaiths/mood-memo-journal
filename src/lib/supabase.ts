
import { createClient } from "@supabase/supabase-js";

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw clear errors if environment variables are missing
if (!supabaseUrl) {
  console.error("Missing VITE_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

// Create Supabase client with fallback to empty strings to prevent runtime errors
// (will display proper error messages in the console)
export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
