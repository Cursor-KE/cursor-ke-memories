# Cursor Kenya - Memories Gallery

A beautiful image gallery showcasing memories from Cursor Kenya events and meetups, built with Next.js, Cloudinary, and Tailwind CSS.

## Features

- 📸 Beautiful masonry grid layout
- 🖼️ Optimized images with blur placeholders
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast loading with Next.js Image optimization
- 📱 Fully responsive design
- 🔍 Modal view for full-screen images

## Deploy to Vercel

### Option 1: Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_FOLDER)

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Import the project to Vercel
3. Add the following environment variables:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvehsjjmg
CLOUDINARY_API_KEY=123576653697321
CLOUDINARY_API_SECRET=gzqGegIfppvQR1SQ5bVX5khB7us
CLOUDINARY_FOLDER=cursor-ke-memories
```

4. Deploy!

## Local Development

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env.local` file with your Cloudinary credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=your-folder-name
```

3. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the gallery.

## References

- Cloudinary API: https://cloudinary.com/documentation/transformation_reference
- Next.js Docs: https://nextjs.org/docs
