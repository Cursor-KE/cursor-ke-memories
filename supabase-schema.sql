-- Create the memories table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  images TEXT[] NOT NULL DEFAULT '{}', -- Array of Cloudinary URLs
  is_black_white BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);

-- Enable Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read
CREATE POLICY "Allow public read access" ON memories
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert
CREATE POLICY "Allow public insert access" ON memories
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows anyone to update
CREATE POLICY "Allow public update access" ON memories
  FOR UPDATE USING (true);

-- Create a policy that allows anyone to delete
CREATE POLICY "Allow public delete access" ON memories
  FOR DELETE USING (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before UPDATE
CREATE TRIGGER update_memories_updated_at
  BEFORE UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

