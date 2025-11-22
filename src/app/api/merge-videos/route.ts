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
    const formData = await request.formData();
    
    // Get video URLs
    const videoUrls: string[] = [];
    let index = 0;
    while (formData.has(`video${index}`)) {
      videoUrls.push(formData.get(`video${index}`) as string);
      index++;
    }

    const audioUrl = formData.get('audio') as string | null;
    const transition = formData.get('transition') as string || 'fade';

    if (videoUrls.length === 0) {
      return NextResponse.json(
        { error: 'No videos provided' },
        { status: 400 }
      );
    }

    console.log('🎬 Merging videos:', videoUrls);
    console.log('🎵 Audio:', audioUrl);
    console.log('✨ Transition:', transition);

    // Use Cloudinary's video transformation API to concatenate videos
    // For simplicity, we'll use the first video as base and overlay the second
    
    if (videoUrls.length === 1 && audioUrl) {
      // Single video with audio overlay
      console.log('📹 Single video mode: Adding audio overlay');
      
      // Extract public ID from Cloudinary URL
      const videoPublicId = extractPublicId(videoUrls[0]);
      const audioPublicId = extractPublicId(audioUrl);
      
      if (!videoPublicId || !audioPublicId) {
        return NextResponse.json(
          { error: 'Invalid Cloudinary URLs' },
          { status: 400 }
        );
      }

      console.log('Video ID:', videoPublicId);
      console.log('Audio ID:', audioPublicId);

      // Generate simple transformation URL with audio overlay
      const transformedUrl = cloudinary.url(`uplix-flow-videos/${videoPublicId}`, {
        resource_type: 'video',
        transformation: [
          { 
            overlay: `video:uplix-audio:${audioPublicId}`,
            flags: 'layer_apply'
          }
        ],
        format: 'mp4'
      });

      console.log('✅ Transformation URL created:', transformedUrl);

      return NextResponse.json({
        success: true,
        videoUrl: transformedUrl,
      });
    }

    // For multiple videos, create a simple concatenation
    // Use first video as base, return it with a note that full merging requires more processing
    console.log('📹 Multiple video mode: Using first video');
    
    const baseVideoUrl = videoUrls[0];
    
    // If audio is provided, overlay it on the first video
    if (audioUrl) {
      const videoPublicId = extractPublicId(baseVideoUrl);
      const audioPublicId = extractPublicId(audioUrl);
      
      if (videoPublicId && audioPublicId) {
        console.log('🎵 Adding audio to first video');
        
        // Simple audio overlay transformation
        const transformedUrl = cloudinary.url(`uplix-flow-videos/${videoPublicId}`, {
          resource_type: 'video',
          transformation: [
            { 
              overlay: `video:uplix-audio:${audioPublicId}`,
              flags: 'layer_apply'
            }
          ],
          format: 'mp4'
        });

        console.log('✅ Transformation URL:', transformedUrl);

        return NextResponse.json({
          success: true,
          videoUrl: transformedUrl,
          message: videoUrls.length > 1 ? `Note: Currently showing first video with audio. Full video concatenation of ${videoUrls.length} videos requires advanced processing.` : undefined
        });
      }
    }

    return NextResponse.json({
      success: true,
      videoUrl: baseVideoUrl,
      message: videoUrls.length > 1 ? `Note: Currently showing first video. Full video concatenation of ${videoUrls.length} videos requires advanced processing. Consider using video editing software for complex merges.` : undefined
    });

  } catch (error: any) {
    console.error('❌ Error merging videos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to merge videos' },
      { status: 500 }
    );
  }
}

function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    // Extract public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{folder}/{public_id}.{format}
    // We want just the file name without folder and extension
    const match = cloudinaryUrl.match(/\/([^/]+)\.(mp4|mp3|jpg|png|webm|mov)$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
