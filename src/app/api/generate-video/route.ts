import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      prompt, 
      instructions, 
      model = 'sora-2', 
      size = '1280x720', 
      seconds = 8,
      inputReference // base64 image for first frame
    } = body

    console.log('=== API ROUTE: GENERATE VIDEO ===')
    console.log('Received body:', JSON.stringify(body, null, 2))
    console.log('Model:', model)
    console.log('Size:', size)
    console.log('Seconds:', seconds)
    console.log('Prompt:', prompt)
    console.log('Instructions:', instructions)
    console.log('Input Reference:', inputReference ? 'Provided' : 'None')

    if (!prompt && !inputReference) {
      console.error('❌ No prompt or input reference provided')
      return NextResponse.json({ error: 'Either prompt or input reference is required' }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY 
    })

    // Build the full prompt
    let finalPrompt = prompt || 'Generate a video based on the reference provided'
    if (instructions) {
      finalPrompt = `${instructions}\n\n${finalPrompt}`
    }

    console.log('📝 Final Prompt:', finalPrompt)

    // Create video generation job
    const createParams: any = {
      model,
      prompt: finalPrompt,
      size,
      seconds: seconds.toString(),
    }

    // Add input reference if provided (base64 image)
    if (inputReference) {
      console.log('🖼️ Processing input reference image')
      
      try {
        // We need to resize the image to match video dimensions
        // Use sharp library for image processing
        const sharp = require('sharp')
        
        // Extract the base64 data from data URL
        const base64Data = inputReference.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        
        // Parse video dimensions from size parameter
        const [width, height] = size.split('x').map(Number)
        
        console.log(`🔧 Resizing image to ${width}x${height}`)
        
        // Resize image to exact video dimensions
        const resizedBuffer = await sharp(buffer)
          .resize(width, height, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 90 })
          .toBuffer()
        
        // Create a File-like object that OpenAI SDK accepts
        const blob = new Blob([resizedBuffer], { type: 'image/jpeg' })
        const file = new File([blob], 'reference.jpg', { type: 'image/jpeg' })
        
        createParams.input_reference = file
        console.log('✅ Reference image resized and ready')
      } catch (error) {
        console.error('❌ Error processing reference image:', error)
        // Continue without reference if processing fails
      }
    }

    console.log('🎬 Creating video generation job with params:', {
      model: createParams.model,
      size: createParams.size,
      seconds: createParams.seconds,
      has_input_reference: !!inputReference
    })
    
    const video = await openai.videos.create(createParams)
    
    console.log('✅ Video job created:', video)
    console.log('Job ID:', video.id)
    console.log('Status:', video.status)

    // Poll for completion
    console.log('⏳ Polling for video completion...')
    let currentVideo = video
    let pollCount = 0
    const maxPolls = 180 // 6 minutes max (2 second intervals)

    while (
      (currentVideo.status === 'queued' || currentVideo.status === 'in_progress') && 
      pollCount < maxPolls
    ) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      currentVideo = await openai.videos.retrieve(video.id)
      pollCount++
      
      const progress = (currentVideo as any).progress || 0
      console.log(`📊 Poll ${pollCount}: Status=${currentVideo.status}, Progress=${progress}%`)
    }

    if (currentVideo.status === 'failed') {
      console.error('❌ Video generation failed')
      const error = (currentVideo as any).error
      return NextResponse.json({ 
        error: error?.message || 'Video generation failed' 
      }, { status: 500 })
    }

    if (currentVideo.status !== 'completed') {
      console.error('❌ Video generation timed out')
      return NextResponse.json({ 
        error: 'Video generation timed out. Please try again.' 
      }, { status: 408 })
    }

    console.log('✅ Video generation completed!')

    // Download the video content
    console.log('⬇️ Downloading video content...')
    const content = await openai.videos.downloadContent(currentVideo.id)
    
    // Convert to base64 data URL for easy storage/display
    const arrayBuffer = await content.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Video = buffer.toString('base64')
    const videoUrl = `data:video/mp4;base64,${base64Video}`

    console.log('🎉 Successfully generated and downloaded video')
    console.log('Video size:', buffer.length, 'bytes')

    return NextResponse.json({ 
      videoUrl,
      videoId: currentVideo.id,
      model: currentVideo.model,
      size: currentVideo.size,
      seconds: currentVideo.seconds
    })
  } catch (error: any) {
    console.error('❌ Error generating video:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    )
  }
}
