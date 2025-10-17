import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isBlackWhite = formData.get('isBlackWhite') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let processedBuffer: Buffer;

    if (isBlackWhite) {
      // Convert to black and white using Sharp
      processedBuffer = await sharp(buffer)
        .grayscale()
        .jpeg({ quality: 90 })
        .toBuffer();
    } else {
      // Just optimize the image
      processedBuffer = await sharp(buffer)
        .jpeg({ quality: 90 })
        .toBuffer();
    }

    // Return the processed image
    return new NextResponse(processedBuffer.buffer.slice(
      processedBuffer.byteOffset,
      processedBuffer.byteOffset + processedBuffer.byteLength
    ), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': processedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
