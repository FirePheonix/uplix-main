import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mediaUrl, mediaType, caption, scheduleTime, userId } = body

    console.log('=== SCHEDULING POST ===')
    console.log('Media URL:', mediaUrl)
    console.log('Schedule Time:', scheduleTime)

    // Insert into Supabase
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        media_url: mediaUrl,
        media_type: mediaType,
        caption,
        schedule_time: scheduleTime,
        status: 'scheduled',
        user_id: userId || 'default', // You can add user authentication later
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving scheduled post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Post scheduled successfully:', data)

    return NextResponse.json({
      success: true,
      scheduledPost: data,
      message: 'Post scheduled successfully!',
    })
  } catch (error: any) {
    console.error('Error scheduling post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to schedule post' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .order('schedule_time', { ascending: true })

    if (error) {
      console.error('Error fetching scheduled posts:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      scheduledPosts: data,
    })
  } catch (error: any) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch scheduled posts' },
      { status: 500 }
    )
  }
}
