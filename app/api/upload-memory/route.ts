import { NextRequest, NextResponse } from 'next/server';
import { supabase, MemoryInsert } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';
import sharp from 'sharp';

// Increase timeout for large uploads
export const maxDuration = 60; // 60 seconds
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
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
        const buffer = Buffer.from(await file.arrayBuffer());
        
        let processedBuffer = buffer;
        
        // Process with Sharp if black & white is requested
        if (isBlackWhite) {
          processedBuffer = await sharp(buffer as Buffer<ArrayBuffer>)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .grayscale()
            .jpeg({ quality: 80 })
            .toBuffer();
        } else {
          processedBuffer = await sharp(buffer as Buffer<ArrayBuffer>)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
        }
        
        // Upload to Cloudinary with timeout
        const uploadPromise = uploadToCloudinary(processedBuffer);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout')), 30000)
        );
        
        const imageUrl = await Promise.race([uploadPromise, timeoutPromise]) as string;
        imageUrls.push(imageUrl);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
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
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
