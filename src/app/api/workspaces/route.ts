import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all workspaces
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching workspaces:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workspaces: data })
  } catch (error) {
    console.error('Error in GET /api/workspaces:', error)
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 })
  }
}

// POST - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, flow_data, user_id } = body

    if (!name || !flow_data) {
      return NextResponse.json({ error: 'Name and flow_data are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        flow_data,
        user_id: user_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workspace:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workspace: data })
  } catch (error) {
    console.error('Error in POST /api/workspaces:', error)
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
  }
}
