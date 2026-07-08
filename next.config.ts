import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1536],
    imageSizes: [64, 96, 128, 256, 384, 512],
    qualities: [50, 65, 70, 72, 75],
  },
};

export default nextConfig;
