import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, getTransformedImageUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isBlackWhite = formData.get('isBlackWhite') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary - all processing (resize, quality, grayscale) happens on Cloudinary servers
    const uploadUrl = await uploadToCloudinary(buffer, 'cursor-ke-process', {
      isBlackWhite,
    });

    // Return the Cloudinary URL with optional transformations applied
    const transformedUrl = getTransformedImageUrl(uploadUrl, {
      width: 1920,
      height: 1080,
      isBlackWhite,
      quality: 'auto',
    });

    return NextResponse.json({
      success: true,
      url: transformedUrl,
      originalUrl: uploadUrl,
    });
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Image processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
