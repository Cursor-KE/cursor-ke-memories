import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../utils/cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Get black and white preference
    const isBlackWhite = fields.isBlackWhite?.[0] === 'true';

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);

    // Upload to Cloudinary without applying grayscale effect (faster upload)
    // We'll apply the effect via URL transformations when displaying
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: "cursor-ke-memories",
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
      };

      cloudinary.v2.uploader
        .upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(fileBuffer);
    });

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
}

