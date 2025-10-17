import { NextRequest, NextResponse } from 'next/server';
import { supabase, MemoryInsert } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import sharp from 'sharp';

// Route segment config
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('=== Upload Memory Route Called ===');
  console.log('Method:', request.method);
  console.log('URL:', request.url);
  
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as 'Memory' | 'Activity';
    const isBlackWhite = formData.get('isBlackWhite') === 'true';
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get uploaded files
    const files: File[] = [];
    let fileIndex = 0;
    while (formData.has(`file_${fileIndex}`)) {
      const file = formData.get(`file_${fileIndex}`) as File;
      if (file) {
        files.push(file);
      }
      fileIndex++;
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    // Process and upload images to Cloudinary
    const imageUrls: string[] = [];
    
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        let processedBuffer: Buffer;
        
        // Process with Sharp if black & white is requested
        if (isBlackWhite) {
          processedBuffer = await sharp(uint8Array)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .grayscale()
            .jpeg({ quality: 80 })
            .toBuffer();
        } else {
          processedBuffer = await sharp(uint8Array)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
        }
        
        // Upload to Cloudinary with timeout
        const uploadPromise = uploadToCloudinary(processedBuffer);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout')), 30000)
        );
        
        const imageUrl = await Promise.race([uploadPromise, timeoutPromise]);
        imageUrls.push(imageUrl);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error instanceof Error ? error.message : error);
        // Continue with other files instead of failing completely
        continue;
      }
    }
    
    if (imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images were successfully uploaded' }, { status: 400 });
    }

    // Save to Supabase
    const memoryData: MemoryInsert = {
      title,
      description: description || '',
      category,
      images: imageUrls,
      is_black_white: isBlackWhite,
    };

    const { data, error } = await supabase
      .from('memories')
      .insert([memoryData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      memory: data,
      message: 'Memory uploaded successfully!' 
    });

  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    return NextResponse.json({ error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
