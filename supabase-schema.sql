-- Create the memories table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS memories (
  id BIGSERIAL PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  format TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  bytes INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on public_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_memories_public_id ON memories(public_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read
CREATE POLICY "Allow public read access" ON memories
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert
CREATE POLICY "Allow public insert access" ON memories
  FOR INSERT WITH CHECK (true);

