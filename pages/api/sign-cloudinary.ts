import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../utils/cloudinary";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder: "cursor-ke-memories" } as Record<string, any>;

  try {
    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return res.status(200).json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      folder: "cursor-ke-memories",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to sign request" });
  }
}


