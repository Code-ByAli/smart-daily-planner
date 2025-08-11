# Supabase Backend Setup Guide

## Quick Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New project"
3. Choose your organization
4. Fill in project details:
   - **Name**: Smart Daily Planner
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
5. Wait for project to be created (~2 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT DEFAULT 'anonymous'
);

-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT DEFAULT 'anonymous'
);

-- Create user_settings table
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  ai_suggestions_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- For now, allow anonymous access (you can restrict this later)
CREATE POLICY "Allow anonymous access to tasks" ON tasks
    FOR ALL USING (user_id = 'anonymous');

CREATE POLICY "Allow anonymous access to notes" ON notes
    FOR ALL USING (user_id = 'anonymous');

CREATE POLICY "Allow anonymous access to user_settings" ON user_settings
    FOR ALL USING (user_id = 'anonymous');
```

### 5. Test Your Setup

1. Start your development server: `npm run dev`
2. Try adding a task or note
3. Check your Supabase dashboard → **Table Editor** to see if data is saved

## Features Enabled

✅ **Real-time Database**: All tasks and notes sync with Supabase  
✅ **Offline Fallback**: Local storage backup when offline  
✅ **Optimistic Updates**: Instant UI updates with error handling  
✅ **Data Sync**: Automatic sync between local storage and database  
✅ **Error Handling**: Graceful degradation when database is unavailable

## Next Steps (Optional)

### Authentication Setup

If you want user accounts later:

1. Go to **Authentication** → **Settings** in Supabase
2. Configure your authentication providers
3. Update the RLS policies to use `auth.uid()` instead of 'anonymous'

### Real-time Features

Your app is ready for real-time updates. To enable:

1. In your components, subscribe to Supabase realtime channels
2. Listen for INSERT, UPDATE, DELETE events
3. Update your local state automatically

## Troubleshooting

**Problem**: "Failed to load tasks from database"
**Solution**: Check your environment variables and ensure Supabase project is running

**Problem**: RLS errors
**Solution**: Make sure the RLS policies are created and allow anonymous access

**Problem**: Connection issues  
**Solution**: Verify your project URL and anon key are correct

Your Smart Daily Planner now has a robust backend with PostgreSQL database, real-time capabilities, and automatic syncing!
