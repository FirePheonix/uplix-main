import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dlfalqssz',
  api_key: '939788767567397',
  api_secret: '86AcsKZsuve5pEZdhz2gczoADk8',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      prompt, 
      instructions, 
      imageReference, // base64 image
      duration = 5,
      model = 'kling-video/v2.1/standard/image-to-video',
    } = body

    console.log('=== API ROUTE: GENERATE VIDEO WITH KLING ===')
    console.log('Model:', model)
    console.log('Prompt:', prompt)
    console.log('Duration:', duration)
    console.log('Image Reference:', imageReference ? 'Provided' : 'None')

    if (!imageReference) {
      console.error('❌ No image reference provided for Kling')
      return NextResponse.json({ error: 'Image reference is required for Kling video generation' }, { status: 400 })
    }

    // Upload base64 image to Cloudinary to get a URL
    console.log('📤 Uploading reference image to Cloudinary...')
    const uploadResult = await cloudinary.uploader.upload(imageReference, {
      folder: 'uplix-kling-references',
      resource_type: 'image',
    })
    
    const imageUrl = uploadResult.secure_url
    console.log('✅ Image uploaded to Cloudinary:', imageUrl)

    // Build the full prompt
    let finalPrompt = prompt || 'Animate this image'
    if (instructions) {
      finalPrompt = `${instructions}\n\n${finalPrompt}`
    }

    console.log('📝 Final Prompt:', finalPrompt)

    // Create Kling video generation task
    const apiKey = process.env.AIML_API_KEY || '7087a0aca920437b9f46dd119ed09121'
    const createUrl = 'https://api.aimlapi.com/v2/generate/video/kling/generation'
    
    // Ensure duration is 5 or 10 (default to 5 if invalid)
    const validDuration = duration === 10 ? 10 : 5
    
    const createPayload = {
      model,
      prompt: finalPrompt,
      image_url: imageUrl,
      duration: validDuration.toString(),
    }

    console.log('🎬 Creating Kling video generation task...')
    console.log('🔑 API Key:', apiKey)
    console.log('📦 Payload:', JSON.stringify(createPayload, null, 2))
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload),
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.error('❌ Kling API error:', error)
      throw new Error(`Kling API error: ${error}`)
    }

    const createResult = await createResponse.json()
    const generationId = createResult.id
    console.log('✅ Generation task created, ID:', generationId)
    console.log('Status:', createResult.status)

    // Poll for completion
    console.log('⏳ Polling for video completion...')
    const pollUrl = `https://api.aimlapi.com/v2/generate/video/kling/generation?generation_id=${generationId}`
    
    let pollCount = 0
    const maxPolls = 120 // 20 minutes max (10 second intervals)
    let currentStatus = createResult.status

    while (
      (currentStatus === 'queued' || currentStatus === 'generating') && 
      pollCount < maxPolls
    ) {
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
      
      const pollResponse = await fetch(pollUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!pollResponse.ok) {
        console.error('❌ Poll error:', await pollResponse.text())
        break
      }

      const pollResult = await pollResponse.json()
      currentStatus = pollResult.status
      pollCount++
      
      console.log(`📊 Poll ${pollCount}: Status=${currentStatus}`)

      if (currentStatus === 'completed') {
        console.log('✅ Video generation completed!')
        const videoUrl = pollResult.video.url
        console.log('Video URL:', videoUrl)

        return NextResponse.json({ 
          videoUrl,
          generationId,
          duration: pollResult.duration,
        })
      }

      if (currentStatus === 'error') {
        console.error('❌ Video generation failed:', pollResult.error)
        return NextResponse.json({ 
          error: pollResult.error || 'Video generation failed' 
        }, { status: 500 })
      }
    }

    if (pollCount >= maxPolls) {
      console.error('❌ Video generation timed out')
      return NextResponse.json({ 
        error: 'Video generation timed out. Please try again.' 
      }, { status: 408 })
    }

    return NextResponse.json({ 
      error: 'Video generation failed with unknown status' 
    }, { status: 500 })

  } catch (error: any) {
    console.error('❌ Error generating Kling video:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    )
  }
}
