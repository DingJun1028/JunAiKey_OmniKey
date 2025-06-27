-- supabase/migrations/11_create_profiles_table_add_rune_capacity.sql
-- Create a profiles table to store user metadata like rune capacity
-- Add capacity_cost column to the runes table

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the profiles table
-- This table stores additional user information not directly in auth.users
CREATE TABLE public.profiles (
  -- Use the auth.users id as the primary key and foreign key
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  -- Add custom user metadata here
  rune_capacity integer NOT NULL DEFAULT 100, -- Initial rune capacity (e.g., 100 units)
  -- Add other profile fields as needed (e.g., username, full_name, avatar_url, tier)
  username text UNIQUE, -- Optional: Add a username
  full_name text,
  avatar_url text
);

-- Optional: Add indexes
CREATE INDEX idx_profiles_username ON public.profiles (username);

-- Optional: Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/update their own profile.
CREATE POLICY "Enable read access for users on their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users on their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users on their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Deletion is handled by ON DELETE CASCADE from auth.users

-- Optional: Create a trigger to automatically create a profile when a new user signs up
-- This ensures every user has a corresponding profile record.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, rune_capacity)
  VALUES (NEW.id, 100); -- Set initial rune capacity here
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Add capacity_cost column to the existing runes table
ALTER TABLE public.runes
ADD COLUMN capacity_cost integer NOT NULL DEFAULT 1; -- Default cost is 1 unit

-- Optional: Add an index on capacity_cost if you plan to query/aggregate by it frequently
-- CREATE INDEX idx_runes_capacity_cost ON public.runes (capacity_cost);