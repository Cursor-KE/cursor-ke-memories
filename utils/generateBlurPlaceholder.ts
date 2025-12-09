import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import type { ImageProps } from "./types";

// Tiny 1x1 transparent GIF as a resilient fallback
export const FALLBACK_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const cache = new Map<ImageProps, string>();

function isValidImage(image: ImageProps): boolean {
  return Boolean(image && image.public_id && image.format);
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function getBase64ImageUrl(
  image: ImageProps,
): Promise<string> {
  const cached = cache.get(image);
  if (cached) {
    return cached;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !isValidImage(image)) {
    cache.set(image, FALLBACK_BLUR_DATA_URL);
    return FALLBACK_BLUR_DATA_URL;
  }

  const requestUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`;

  try {
    const response = await fetchWithTimeout(requestUrl, 4000);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();

    try {
      const minified = await imagemin.buffer(Buffer.from(buffer), {
        plugins: [imageminJpegtran()],
      });
      const url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
      cache.set(image, url);
      return url;
    } catch (minifyError) {
      // If imagemin fails, fall back to unoptimized buffer
      const url = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
      cache.set(image, url);
      return url;
    }
  } catch (fetchError) {
    // Network errors, timeouts, or any unexpected failure
    cache.set(image, FALLBACK_BLUR_DATA_URL);
    return FALLBACK_BLUR_DATA_URL;
  }
}
