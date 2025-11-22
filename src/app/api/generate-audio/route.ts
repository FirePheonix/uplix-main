import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dlfalqssz',
  api_key: '939788767567397',
  api_secret: '86AcsKZsuve5pEZdhz2gczoADk8',
})

const ELEVENLABS_VOICES = [
  'Rachel', 'Drew', 'Clyde', 'Paul', 'Aria', 'Domi', 'Dave', 'Roger', 
  'Fin', 'Sarah', 'Antoni', 'Laura', 'Thomas', 'Charlie', 'George', 
  'Emily', 'Elli', 'Callum', 'Patrick', 'River', 'Harry', 'Liam', 
  'Dorothy', 'Josh', 'Arnold', 'Charlotte', 'Alice', 'Matilda', 'James', 
  'Joseph', 'Will', 'Jeremy', 'Jessica', 'Eric', 'Michael', 'Ethan', 
  'Chris', 'Gigi', 'Freya', 'Santa Claus', 'Brian', 'Grace', 'Daniel', 
  'Lily', 'Serena', 'Adam', 'Nicole', 'Bill', 'Jessie', 'Sam', 'Glinda', 
  'Giovanni', 'Mimi'
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      text,
      voice = 'Nicole',
      model = 'elevenlabs/eleven_turbo_v2_5',
    } = body

    console.log('=== API ROUTE: GENERATE AUDIO ===')
    console.log('Model:', model)
    console.log('Voice:', voice)
    console.log('Text length:', text?.length || 0)

    if (!text) {
      console.error('❌ No text provided')
      return NextResponse.json({ error: 'Text is required for audio generation' }, { status: 400 })
    }

    // Validate voice
    if (!ELEVENLABS_VOICES.includes(voice)) {
      console.error('❌ Invalid voice:', voice)
      return NextResponse.json({ 
        error: `Invalid voice. Must be one of: ${ELEVENLABS_VOICES.join(', ')}` 
      }, { status: 400 })
    }

    const apiKey = process.env.AIML_API_KEY || '7087a0aca920437b9f46dd119ed09121'
    const url = 'https://api.aimlapi.com/v1/tts'

    console.log('🎤 Generating audio with ElevenLabs...')
    console.log('🔑 API Key:', apiKey)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        text,
        voice,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ ElevenLabs API error:', error)
      throw new Error(`ElevenLabs API error: ${error}`)
    }

    console.log('✅ Audio generated, uploading to Cloudinary...')

    // Get audio as buffer
    const audioBuffer = await response.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    const audioDataUrl = `data:audio/wav;base64,${audioBase64}`

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(audioDataUrl, {
      folder: 'uplix-audio',
      resource_type: 'video', // Cloudinary uses 'video' for audio files
      format: 'mp3',
    })

    const audioUrl = uploadResult.secure_url
    console.log('✅ Audio uploaded to Cloudinary:', audioUrl)

    return NextResponse.json({ 
      audioUrl,
      duration: uploadResult.duration,
    })

  } catch (error: any) {
    console.error('❌ Error generating audio:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to generate audio' },
      { status: 500 }
    )
  }
}
