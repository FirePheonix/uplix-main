import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dlfalqssz',
  api_key: '939788767567397',
  api_secret: '86AcsKZsuve5pEZdhz2gczoADk8',
});

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const cover = formData.get('cover') as File | null;
    const caption = formData.get('caption') as string || '';
    const accessToken = formData.get('accessToken') as string;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Instagram account not connected' },
        { status: 401 }
      );
    }

    console.log('📤 Uploading video to Cloudinary...');

    // Convert video to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: 'uplix-instagram-reels',
      resource_type: 'video',
    });

    const videoUrl = uploadResult.secure_url;
    console.log('✅ Video uploaded:', videoUrl);

    let coverUrl = '';
    if (cover) {
      console.log('📤 Uploading cover image to Cloudinary...');
      const coverBytes = await cover.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      const coverBase64 = coverBuffer.toString('base64');
      const coverDataUrl = `data:${cover.type};base64,${coverBase64}`;

      const coverUploadResult = await cloudinary.uploader.upload(coverDataUrl, {
        folder: 'uplix-instagram-reels',
        resource_type: 'image',
      });

      coverUrl = coverUploadResult.secure_url;
      console.log('✅ Cover image uploaded:', coverUrl);
    }

    // Step 1: Create media container for Reel
    console.log('📝 Creating Instagram Reel container...');
    console.log('Using Instagram Business Account ID:', userId);
    console.log('Video URL:', videoUrl);
    
    const containerParams: any = {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption,
      access_token: accessToken,
      share_to_feed: true, // Share to main feed
    };

    // Add cover URL if provided
    if (coverUrl) {
      containerParams.thumb_offset = 0; // Use cover image instead of auto-generated thumbnail
      containerParams.cover_url = coverUrl;
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${userId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(containerParams),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      console.error('❌ Reel container creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create reel container', details: error },
        { status: 500 }
      );
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;
    console.log('✅ Reel container created:', creationId);

    // Step 2: Poll for processing status
    console.log('⏳ Waiting for video to be processed...');
    let isProcessed = false;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (!isProcessed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(
        `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('Status:', statusData.status_code);

        if (statusData.status_code === 'FINISHED') {
          isProcessed = true;
        } else if (statusData.status_code === 'ERROR') {
          return NextResponse.json(
            { error: 'Video processing failed' },
            { status: 500 }
          );
        }
      }

      attempts++;
    }

    if (!isProcessed) {
      return NextResponse.json(
        { error: 'Video processing timeout' },
        { status: 500 }
      );
    }

    // Step 3: Publish the reel
    console.log('🚀 Publishing reel...');
    
    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      console.error('❌ Publish error:', error);
      return NextResponse.json(
        { error: 'Failed to publish reel', details: error },
        { status: 500 }
      );
    }

    const publishData = await publishResponse.json();
    console.log('✅ Reel published successfully:', publishData);

    return NextResponse.json({
      success: true,
      reelId: publishData.id,
      message: 'Reel created successfully!',
    });

  } catch (error: any) {
    console.error('❌ Error creating Instagram reel:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create reel' },
      { status: 500 }
    );
  }
}
