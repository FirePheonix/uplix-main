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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'uplix-audio',
      resource_type: 'video', // Cloudinary uses 'video' for audio files
    })

    return NextResponse.json({
      url: result.secure_url,
      duration: result.duration,
    })
  } catch (error: any) {
    console.error('Error uploading audio:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload audio' },
      { status: 500 }
    )
  }
}
