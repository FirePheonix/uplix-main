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
    const caption = formData.get('caption') as string || '';
    const accessToken = formData.get('accessToken') as string;
    const userId = formData.get('userId') as string;

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Instagram account not connected' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log('📤 Uploading image to Cloudinary...');

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: 'uplix-instagram',
      resource_type: 'image',
    });

    const imageUrl = uploadResult.secure_url;
    console.log('✅ Image uploaded:', imageUrl);

    // Step 1: Create media container
    console.log('📝 Creating Instagram media container...');
    console.log('Using Instagram Business Account ID:', userId);
    console.log('Image URL:', imageUrl);
    
    const containerParams = new URLSearchParams({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    });

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${userId}/media?${containerParams}`,
      {
        method: 'POST',
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      console.error('❌ Container creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create media container', details: error },
        { status: 500 }
      );
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;
    console.log('✅ Media container created:', creationId);

    // Step 2: Publish the media
    console.log('🚀 Publishing media...');
    
    const publishParams = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken,
    });

    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${userId}/media_publish?${publishParams}`,
      {
        method: 'POST',
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      console.error('❌ Publish error:', error);
      return NextResponse.json(
        { error: 'Failed to publish post', details: error },
        { status: 500 }
      );
    }

    const publishData = await publishResponse.json();
    console.log('✅ Post published successfully:', publishData);

    return NextResponse.json({
      success: true,
      postId: publishData.id,
      message: 'Post created successfully!',
    });

  } catch (error: any) {
    console.error('❌ Error creating Instagram post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
