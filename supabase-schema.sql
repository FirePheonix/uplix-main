-- Create scheduled_posts table in Supabase
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/tliywpmkonjcsekebvst/sql

CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT NOT NULL,
  schedule_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  instagram_post_id TEXT,
  error_message TEXT,
  user_id TEXT
);

-- Create index on schedule_time for faster queries
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_schedule_time ON public.scheduled_posts(schedule_time);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON public.scheduled_posts(status);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this later)
CREATE POLICY "Allow all operations on scheduled_posts" 
ON public.scheduled_posts 
FOR ALL 
USING (true) 
WITH CHECK (true);
