import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Fetch all images
    const images = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 500,
      type: 'upload',
    })

    // Fetch all videos
    const videos = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 500,
      type: 'upload',
    })

    // Combine and format the results
    const allMedia = [
      ...images.resources.map((resource: any) => ({
        id: resource.public_id,
        type: 'image',
        url: resource.secure_url,
        title: resource.public_id.split('/').pop() || 'Untitled',
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        format: resource.format,
      })),
      ...videos.resources.map((resource: any) => ({
        id: resource.public_id,
        type: 'video',
        url: resource.secure_url,
        title: resource.public_id.split('/').pop() || 'Untitled',
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        format: resource.format,
        duration: resource.duration,
      })),
    ]

    // Sort by creation date (newest first)
    allMedia.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ media: allMedia })
  } catch (error: any) {
    console.error('Error fetching from Cloudinary:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch media from Cloudinary' },
      { status: 500 }
    )
  }
}
