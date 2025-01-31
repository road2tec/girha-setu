import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "png.pngtree.com",
      },
    ],
  },
};

export default nextConfig;
