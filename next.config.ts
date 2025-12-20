import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ybmiliaszziuywnb.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
