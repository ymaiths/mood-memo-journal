
import { createClient } from "@supabase/supabase-js";

// Real Supabase project details for mood-memo-journey
const supabaseUrl = "https://jxcanjekdejpofpzgqnz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y2FuamVrZGVqcG9mcHpncW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTg4NjMsImV4cCI6MjA2MDg3NDg2M30.ktu0OLr5EiENhNHMHfXBp0gPf9IrxPzMsREMlhLLdLY";

// Create Supabase client with proper configuration for browser environment
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,  // Ensures session persistence
      autoRefreshToken: true, // Auto refresh token when expired
      storage: localStorage  // Use localStorage for session storage
    }
  }
);
