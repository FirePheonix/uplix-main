import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaUrl, userPrompt, scheduleTime, mediaType = 'image', accessToken, userId } = body;

    console.log('=== CREATING INSTAGRAM POST ===');
    console.log('Media URL:', mediaUrl);
    console.log('User Prompt:', userPrompt);
    console.log('Schedule Time:', scheduleTime);
    console.log('Media Type:', mediaType);
    console.log('User ID:', userId);

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Instagram account not connected. Please connect your Instagram account first.' },
        { status: 401 }
      );
    }

    if (!mediaUrl) {
      return NextResponse.json(
        { error: 'No media URL provided' },
        { status: 400 }
      );
    }

    // Use the caption directly (it's already generated on the client)
    const caption = userPrompt || '';
    console.log('📝 Using caption:', caption);

    // If scheduled, save for later posting
    if (scheduleTime) {
      console.log('📅 Scheduling post for:', scheduleTime);
      
      // TODO: Store in database for scheduled posting
      // For now, return success with schedule info
      return NextResponse.json({
        success: true,
        scheduled: true,
        scheduleTime,
        caption,
        message: 'Post scheduled successfully! (Note: Implement database storage for production)',
      });
    }

    const isVideo = mediaType === 'video' || mediaUrl.includes('.mp4') || mediaUrl.includes('video');

    // Step 1: Create media container
    console.log('📝 Creating Instagram media container...');
    console.log('Using Instagram Business Account ID:', userId);
    console.log('Media URL:', mediaUrl);
    console.log('Media type:', isVideo ? 'VIDEO' : 'IMAGE');
    
    const containerParams = new URLSearchParams({
      access_token: accessToken,
      ...(isVideo 
        ? { 
            media_type: 'REELS',
            video_url: mediaUrl,
          }
        : { 
            image_url: mediaUrl,
          }),
      ...(caption && { caption }),
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

    // Step 2: Check container status (for videos)
    if (isVideo) {
      console.log('⏳ Waiting for video processing...');
      let statusCheckCount = 0;
      const maxChecks = 30;

      while (statusCheckCount < maxChecks) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusResponse = await fetch(
          `https://graph.facebook.com/v21.0/${creationId}?fields=status_code,status&access_token=${accessToken}`
        );
        const statusData = await statusResponse.json();
        console.log(`Status check ${statusCheckCount + 1}:`, statusData);

        if (statusData.status_code === 'FINISHED') {
          console.log('✅ Video processing complete');
          break;
        } else if (statusData.status_code === 'ERROR') {
          console.error('❌ Video processing failed');
          return NextResponse.json(
            { error: 'Video processing failed', details: statusData },
            { status: 400 }
          );
        }

        statusCheckCount++;
      }

      if (statusCheckCount >= maxChecks) {
        console.error('❌ Video processing timeout');
        return NextResponse.json(
          { error: 'Video processing timeout' },
          { status: 408 }
        );
      }
    }

    // Step 3: Publish the media
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
      caption,
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
