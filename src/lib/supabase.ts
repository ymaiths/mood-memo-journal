
import { createClient } from "@supabase/supabase-js";

// Default URLs for development that will allow the app to load
// These won't connect to a real Supabase project, but will prevent the app from crashing
const defaultSupabaseUrl = "https://example.supabase.co";
const defaultSupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZ0cXhjZmZzYnRxaHB5cmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgwMDUyMDUsImV4cCI6MjAxMzU4MTIwNX0.bUxUQnFHUFBPaO5WHo1t8tJcjHYBf9sezn096-atWr8";

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseKey;

// Log warnings if using default values
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn("⚠️ Using default Supabase URL. Connect to Supabase to use real authentication and database features.");
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Using default Supabase Anon Key. Connect to Supabase to use real authentication and database features.");
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
