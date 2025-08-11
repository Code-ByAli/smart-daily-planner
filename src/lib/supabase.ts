import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration missing. Using local storage fallback.");
}

export const supabase = createClient(
  supabaseUrl || "https://localhost:3000",
  supabaseAnonKey || "dummy-key"
);

// Database table names
export const TABLES = {
  TASKS: "tasks",
  NOTES: "notes",
  USER_SETTINGS: "user_settings",
} as const;

// Database types
export interface DatabaseTask {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface DatabaseNote {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  ai_suggestions_enabled: boolean;
  created_at: string;
  updated_at: string;
}
