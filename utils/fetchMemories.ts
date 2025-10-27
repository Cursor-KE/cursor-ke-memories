import { supabase } from "./supabase";

export interface Memory {
  id: string;
  title: string;
  description: string | null;
  category: string;
  images: string[];
  is_black_white: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memories:", error);
    return [];
  }

  return data || [];
}

export function getPublicIdFromUrl(url: string): string {
  // Extract public_id from Cloudinary URL
  // Format: https://res.cloudinary.com/cloud_name/image/upload/v.../folder/public_id.format
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

export function getFormatFromUrl(url: string): string {
  const parts = url.split(".");
  return parts[parts.length - 1];
}

