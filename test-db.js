// Test Supabase Database Connection
import { supabase } from "./src/lib/supabase.js";

async function testConnection() {
  console.log("🔍 Testing Supabase connection...");

  try {
    // Test basic connection
    const { data, error } = await supabase.from("tasks").select("count");

    if (error) {
      console.error("❌ Connection failed:", error.message);
      if (error.message.includes('relation "tasks" does not exist')) {
        console.log(
          "📝 The tasks table needs to be created in your Supabase database"
        );
        console.log("👉 Please run the SQL commands in database-setup.sql");
      }
      return false;
    }

    console.log("✅ Supabase connection successful!");
    console.log("📊 Tasks table exists and is accessible");
    return true;
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    return false;
  }
}

testConnection();
