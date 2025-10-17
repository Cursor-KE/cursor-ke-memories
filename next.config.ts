import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ensure API routes work properly
  },
  // Ensure API routes are properly built
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default nextConfig;
