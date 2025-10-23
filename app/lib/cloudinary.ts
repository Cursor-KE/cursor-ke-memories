import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Verify Cloudinary configuration
function verifyCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  return true;
}

/**
 * Upload image to Cloudinary with responsive transformations
 * Uses eager transformations to generate optimized variants on-server
 */
export async function uploadToCloudinary(
  file: Buffer,
  folder: string = 'cursor-ke-memories',
  options: { isBlackWhite?: boolean } = {}
): Promise<string> {
  // Verify Cloudinary configuration
  verifyCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      timeout: 60000,
      // Apply black & white effect if requested
      ...(options.isBlackWhite && { effect: 'grayscale' }),
    };

    console.log('Uploading to Cloudinary with options:', {
      folder,
      isBlackWhite: options.isBlackWhite,
      fileSize: file.length,
    });

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        // Extract meaningful error message
        const errorMessage = error.message || error.http_code || JSON.stringify(error);
        reject(new Error(`Cloudinary upload failed: ${errorMessage}`));
      } else if (result) {
        console.log('Cloudinary upload successful:', result.secure_url);
        resolve(result.secure_url);
      } else {
        reject(new Error('No result from Cloudinary'));
      }
    });

    stream.end(file);
  });
}

/**
 * Generate a transformed image URL with optional black & white effect
 * Uses Cloudinary's URL-based transformations (no server-side processing needed)
 */
export function getTransformedImageUrl(
  publicUrl: string,
  options: {
    width?: number;
    height?: number;
    isBlackWhite?: boolean;
    quality?: 'auto' | number;
  } = {}
): string {
  const { width = 800, height = 600, isBlackWhite = false, quality = 'auto' } = options;

  // Parse Cloudinary URL to apply transformations
  const transformations = [];

  if (isBlackWhite) {
    transformations.push('e_grayscale');
  }

  if (width || height) {
    transformations.push(
      `w_${width || 'auto'},h_${height || 'auto'},c_limit,f_auto,q_${quality}`
    );
  } else {
    transformations.push(`f_auto,q_${quality}`);
  }

  // Replace /upload/ with /upload/transformation/
  if (transformations.length > 0) {
    return publicUrl.replace('/upload/', `/upload/${transformations.join('/')}/`);
  }

  return publicUrl;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
