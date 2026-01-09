import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ytzuf3gtvyxheja2.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
