import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "png.pngtree.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
