import { createClient } from '@supabase/supabase-js';
import cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface Memory {
  id: string;
  title: string;
  description: string | null;
  category: string;
  images: string[];
  is_black_white: boolean;
  created_at: string;
  updated_at: string;
}

interface ImageInfo {
  width: number;
  height: number;
  bytes: number;
  format: string;
}

function extractPublicId(url: string): string | null {
  const parts = url.split("/");
  const filenameWithExt = parts[parts.length - 1];
  const filename = filenameWithExt.split(".")[0];
  const folderIndex = parts.findIndex(part => part === "upload");
  
  if (folderIndex !== -1 && folderIndex + 1 < parts.length) {
    const folderParts = parts.slice(folderIndex + 2, -1);
    return folderParts.length > 0 ? `${folderParts.join("/")}/${filename}` : filename;
  }
  return filename;
}

async function getImageInfo(publicId: string): Promise<ImageInfo | null> {
  try {
    const result = await cloudinary.v2.api.resource(publicId);
    return {
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    };
  } catch (error) {
    console.error(`Error fetching info for ${publicId}:`, error);
    return null;
  }
}

async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error(`Error deleting ${publicId} from Cloudinary:`, error);
    return false;
  }
}

async function deleteFromSupabase(memoryId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", memoryId);
    
    if (error) {
      console.error(`Error deleting ${memoryId} from Supabase:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting ${memoryId} from Supabase:`, error);
    return false;
  }
}

async function main() {
  console.log("🔍 Starting quality check...\n");

  // Fetch all memories
  const { data: memories, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error);
    process.exit(1);
  }

  console.log(`Found ${memories.length} memories\n`);

  const poorQualityImages: Array<{
    memory: Memory;
    reason: string;
    imageInfo?: ImageInfo;
  }> = [];

  // Define quality criteria
  const QUALITY_CRITERIA = {
    MIN_WIDTH: 800,           // Minimum width in pixels
    MIN_HEIGHT: 600,          // Minimum height in pixels
    MIN_BYTES: 50000,         // Minimum file size (50KB)
    MAX_BYTES: 10000000,      // Maximum file size (10MB) - might indicate poor optimization
    MAX_BYTES_PER_PIXEL: 0.5, // Bytes per pixel ratio
  };

  // Check each memory
  for (const memory of memories) {
    // Criterion 1: No title
    if (!memory.title || memory.title.trim() === "" || memory.title === "Untitled Memory") {
      poorQualityImages.push({
        memory,
        reason: "Missing or invalid title",
      });
      continue;
    }

    // Criterion 2: Check each image in the memory
    for (const imageUrl of memory.images) {
      const publicId = extractPublicId(imageUrl);
      if (!publicId) {
        poorQualityImages.push({
          memory,
          reason: "Invalid Cloudinary URL",
        });
        continue;
      }

      const imageInfo = await getImageInfo(publicId);
      if (!imageInfo) {
        poorQualityImages.push({
          memory,
          reason: "Failed to fetch image info",
        });
        continue;
      }

      // Check dimensions
      if (imageInfo.width < QUALITY_CRITERIA.MIN_WIDTH || 
          imageInfo.height < QUALITY_CRITERIA.MIN_HEIGHT) {
        poorQualityImages.push({
          memory,
          reason: `Low resolution: ${imageInfo.width}x${imageInfo.height}`,
          imageInfo,
        });
        continue;
      }

      // Check file size
      if (imageInfo.bytes < QUALITY_CRITERIA.MIN_BYTES) {
        poorQualityImages.push({
          memory,
          reason: `File too small: ${(imageInfo.bytes / 1024).toFixed(2)}KB`,
          imageInfo,
        });
        continue;
      }

      // Check bytes per pixel ratio (over-compressed)
      const bytesPerPixel = imageInfo.bytes / (imageInfo.width * imageInfo.height);
      if (bytesPerPixel < QUALITY_CRITERIA.MAX_BYTES_PER_PIXEL) {
        poorQualityImages.push({
          memory,
          reason: `Over-compressed: ${bytesPerPixel.toFixed(4)} bytes/pixel`,
          imageInfo,
        });
        continue;
      }
    }
  }

  // Display results
  console.log(`\n📊 Quality Check Results:`);
  console.log(`   Total memories: ${memories.length}`);
  console.log(`   Poor quality found: ${poorQualityImages.length}\n`);

  if (poorQualityImages.length === 0) {
    console.log("✅ No poor quality images found!");
    process.exit(0);
  }

  // Show details
  console.log("⚠️  Poor Quality Images:\n");
  poorQualityImages.forEach((item, index) => {
    console.log(`${index + 1}. Memory ID: ${item.memory.id}`);
    console.log(`   Title: ${item.memory.title || "No title"}`);
    console.log(`   Reason: ${item.reason}`);
    if (item.imageInfo) {
      console.log(`   Dimensions: ${item.imageInfo.width}x${item.imageInfo.height}`);
      console.log(`   Size: ${(item.imageInfo.bytes / 1024).toFixed(2)}KB`);
    }
    console.log("");
  });

  // Ask for confirmation
  console.log("\n⚠️  WARNING: This will permanently delete these images from Cloudinary and Supabase!");
  console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");
  
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Delete poor quality images
  console.log("🗑️  Starting deletion...\n");

  let deletedCount = 0;
  let failedCount = 0;

  for (const item of poorQualityImages) {
    try {
      // Delete from Cloudinary
      let cloudinarySuccess = true;
      for (const imageUrl of item.memory.images) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          cloudinarySuccess = await deleteFromCloudinary(publicId);
        }
      }

      // Delete from Supabase
      const supabaseSuccess = await deleteFromSupabase(item.memory.id);

      if (cloudinarySuccess && supabaseSuccess) {
        console.log(`✅ Deleted: ${item.memory.title} (${item.memory.id})`);
        deletedCount++;
      } else {
        console.log(`❌ Failed to delete: ${item.memory.title} (${item.memory.id})`);
        failedCount++;
      }
    } catch (error) {
      console.error(`❌ Error deleting ${item.memory.id}:`, error);
      failedCount++;
    }
  }

  console.log(`\n✨ Deletion complete!`);
  console.log(`   Successfully deleted: ${deletedCount}`);
  console.log(`   Failed: ${failedCount}`);
}

main().catch(console.error);

