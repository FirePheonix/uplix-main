import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tliywpmkonjcsekebvst.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaXl3cG1rb25qY3Nla2VidnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDg1NDEsImV4cCI6MjA3OTQyNDU0MX0.oLL0XVRD-OUrw8b66NAv9W8rYdYN99GhB8afJrd7lQA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ScheduledPost = {
  id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string
  schedule_time: string
  status: 'scheduled' | 'posted' | 'failed'
  created_at: string
  instagram_post_id?: string
  error_message?: string
}
