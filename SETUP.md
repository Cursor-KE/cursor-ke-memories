# Cursor Kenya Memories - Setup Guide

## Why Images Aren't Loading

Your app couldn't fetch images because the **database schema doesn't match what the code expects**. The old schema had different columns than what the app is trying to read.

## Fix Steps

### 1. Update Your Supabase Database

Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/wlqtxgvsbxpttdzwpwbm/sql/new) and run the updated SQL from `supabase-schema.sql`:

```sql
-- Drop the old table first (WARNING: This deletes all existing data!)
DROP TABLE IF EXISTS memories CASCADE;

-- Then run the new schema from supabase-schema.sql
-- Copy and paste the entire contents of supabase-schema.sql
```

### 2. Add Sample Data (Optional)

After creating the table, add some test data:

```sql
INSERT INTO memories (title, description, category, images, is_black_white)
VALUES 
(
  'Cursor Kenya Meetup 2024',
  'Amazing turnout at our first meetup!',
  'events',
  ARRAY['cursor-kenya/meetup-2024/photo1.jpg', 'cursor-kenya/meetup-2024/photo2.jpg'],
  false
),
(
  'Hackathon Winners',
  'Congratulations to all participants',
  'hackathon',
  ARRAY['cursor-kenya/hackathon/winners.jpg'],
  false
);
```

### 3. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
pnpm run dev
```

### 4. Upload Real Images

Once the dev server is running, click the "+" button in the bottom right to upload memories with images.

## Environment Variables

All your API keys are already configured in `.env`:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

## Database Schema

The new `memories` table has:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Memory title |
| `description` | TEXT | Optional description |
| `category` | TEXT | Category (events, hackathon, meetup, etc.) |
| `images` | TEXT[] | Array of Cloudinary image URLs |
| `is_black_white` | BOOLEAN | Apply grayscale filter? |
| `created_at` | TIMESTAMP | When created |
| `updated_at` | TIMESTAMP | Last updated (auto-updated) |

## Troubleshooting

If images still don't load after updating the schema:

1. Check browser console for errors (F12)
2. Verify the `memories` table exists in Supabase
3. Make sure RLS policies are active
4. Check that your Cloudinary images exist at the URLs stored in the database
