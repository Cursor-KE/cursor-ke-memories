import { NextRequest, NextResponse } from 'next/server';
import { supabase, MemoryInsert } from '@/lib/supabase';
import { uploadToCloudinary } from '@/lib/cloudinary';

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

    // Upload images directly to Cloudinary (processing done on their servers)
    const imageUrls: string[] = [];
    const uploadErrors: string[] = [];
    
    for (const file of files) {
      try {
        console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Upload to Cloudinary with Cloudinary handling all transformations
        // This removes the memory-intensive Sharp processing from our serverless function
        const uploadPromise = uploadToCloudinary(buffer, 'cursor-ke-memories', {
          isBlackWhite,
        });
        
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout')), 60000)
        );
        
        const imageUrl = await Promise.race([uploadPromise, timeoutPromise]);
        imageUrls.push(imageUrl);
        console.log(`Successfully uploaded ${file.name}: ${imageUrl}`);
        
      } catch (error) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else {
          errorMessage = JSON.stringify(error);
        }
        console.error(`Error uploading file ${file.name}:`, errorMessage);
        uploadErrors.push(`${file.name}: ${errorMessage}`);
        // Continue with other files instead of failing completely
        continue;
      }
    }
    
    if (imageUrls.length === 0) {
      console.error('No images were successfully uploaded. Errors:', uploadErrors);
      return NextResponse.json({ 
        error: 'No images were successfully uploaded',
        details: uploadErrors.length > 0 ? uploadErrors : 'Unknown error'
      }, { status: 400 });
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
