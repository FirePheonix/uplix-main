-- Workspaces Schema for Flow Generator
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/tliywpmkonjcsekebvst/sql

-- Create workspaces table for flow generator
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  flow_data JSONB NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON public.workspaces(user_id);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_workspaces_updated_at ON public.workspaces(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on workspaces" 
ON public.workspaces 
FOR ALL 
USING (true) 
WITH CHECK (true);
