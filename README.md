# Cursor KE - Community Memories Platform

A modern web application for Kenya's premier AI-powered development community, built with **Next.js 15**, **TypeScript**, and optimized for serverless deployment with **Vercel**.

🌍 **Live Demo:** [https://hackimage.vercel.app/](https://hackimage.vercel.app/)

## 📋 Features

- **Community Memories Gallery** - Showcase and celebrate community achievements through photos
- **Image Upload & Processing** - Upload and manage community photos with automatic optimization
- **Black & White Conversion** - Optional grayscale effect for vintage memories
- **Responsive Design** - Beautiful UI built with shadcn/ui and Tailwind CSS
- **Database Integration** - Supabase backend for memory storage
- **Optimized Image Hosting** - Cloudinary CDN for fast global delivery
- **Serverless Functions** - API routes for image processing and data management

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API Routes, Node.js
- **Database:** Supabase (PostgreSQL)
- **Image Processing:** Cloudinary API
- **Hosting:** Vercel (Hobby Plan)
- **Package Manager:** pnpm
- **Linting:** Biome

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (`npm install -g pnpm`)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hackimage
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
hackimage/
├── app/
│   ├── api/
│   │   ├── memories/route.ts          # Fetch memories
│   │   ├── process-image/route.ts     # Image processing endpoint
│   │   └── upload-memory/route.ts     # Memory upload endpoint
│   ├── components/
│   │   ├── Gallery.tsx                # Memories gallery
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── Hero.tsx                   # Hero section
│   │   ├── Footer.tsx                 # Footer
│   │   ├── UploadMemory.tsx           # Upload form
│   │   └── ui/                        # shadcn/ui components
│   ├── lib/
│   │   ├── cloudinary.ts              # Cloudinary integration
│   │   ├── supabase.ts                # Supabase client
│   │   └── utils.ts                   # Utility functions
│   ├── types/
│   │   └── award.ts                   # TypeScript types
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Home page
├── public/                            # Static assets
├── .env                               # Environment variables (not committed)
├── biome.json                         # Linting config
├── next.config.ts                     # Next.js configuration
├── vercel.json                        # Vercel deployment config
├── tsconfig.json                      # TypeScript config
└── package.json                       # Project dependencies
```

## 🔧 Available Commands

```bash
# Development
pnpm dev              # Start development server

# Build
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome

# Deployment
vercel deploy         # Deploy to staging
vercel deploy --prod  # Deploy to production
```

## 🌥️ API Endpoints

### `POST /api/upload-memory`
Upload a new memory with images.

**Request:**
```javascript
formData.append('title', 'Event Name');
formData.append('description', 'Event description');
formData.append('category', 'Memory'); // or 'Activity'
formData.append('file_0', imageFile);
formData.append('isBlackWhite', false);
```

**Response:**
```json
{
  "success": true,
  "memory": {
    "id": "uuid",
    "title": "Event Name",
    "images": ["https://cloudinary.com/..."],
    "created_at": "2024-10-22T..."
  }
}
```

### `GET /api/memories`
Fetch all community memories.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Community Meetup",
    "description": "First meetup",
    "images": ["https://cloudinary.com/..."],
    "category": "Memory",
    "created_at": "2024-10-22T..."
  }
]
```

### `POST /api/process-image`
Process an image with transformations.

**Request:**
```javascript
formData.append('file', imageFile);
formData.append('isBlackWhite', true);
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "originalUrl": "https://res.cloudinary.com/..."
}
```

## 📊 Architecture & Optimization

### Image Processing Pipeline
We optimized our deployment by migrating image processing from local Sharp processing to **Cloudinary's server-side transformations**. This reduced memory usage by ~80% and enabled deployment on Vercel's free Hobby plan.

**Key Benefits:**
- ✅ Memory usage reduced from 2-3GB to <500MB
- ✅ Processing faster with CDN advantage
- ✅ Automatic image format optimization (WebP, AVIF)
- ✅ Global edge delivery

Read the full technical deep-dive: [Sharp Pain to Cloudinary Gain](./BLOG_CLOUDINARY_MIGRATION.md)

## 🗄️ Database Schema

### `memories` table
```sql
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'Memory' or 'Activity'
  images TEXT[] NOT NULL,
  is_black_white BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Public Cloudinary cloud name |

**Note:** Never commit `.env` files. Environment variables are managed via Vercel Dashboard for production.

## 📈 Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
vercel link
```

2. **Add environment variables**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```

3. **Deploy**
```bash
vercel deploy --prod
```

### Vercel Configuration
The `vercel.json` file configures:
- API function memory limit: 2048MB (Hobby plan compatible)
- Max execution time: 60 seconds
- Build command: `pnpm run build`
- Install command: `pnpm install`

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Button
- Card
- Dialog
- Dropdown Menu
- Input
- Label
- Separator
- Textarea
- Tooltip
- Avatar
- Badge

All components are styled with Tailwind CSS for a modern, responsive design.

## 🐛 Troubleshooting

### Development Issues

**Issue:** Port 3000 already in use
```bash
pnpm dev -- --port 3001
```

**Issue:** Supabase connection errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check network connectivity
- Ensure Supabase project is active

### Production Issues

**Issue:** Images not loading
- Verify Cloudinary credentials are correct
- Check Cloudinary account free tier limits
- Verify environment variables in Vercel dashboard

**Issue:** Memory limit errors
- Already solved! See [blog post](./BLOG_CLOUDINARY_MIGRATION.md)
- Memory limit properly configured in `vercel.json`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Community

Join the **Cursor Kenya Community:**
- 500+ Developers
- Monthly Meetups
- AI-Powered Coding
- Career Development

**Website:** [https://cursorke.vercel.app](https://cursorke.vercel.app)

---

**Last Updated:** October 2024  
**Built with ❤️ for the Cursor Kenya Community**
