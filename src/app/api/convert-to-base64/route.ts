import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Converting image to base64:', imageUrl);

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert to base64
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('✅ Image converted to base64, length:', base64.length);

    return NextResponse.json({
      base64: dataUrl,
      length: base64.length
    });
  } catch (error: unknown) {
    console.error('❌ Error converting image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
