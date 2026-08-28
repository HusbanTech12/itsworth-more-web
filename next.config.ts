import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/binary deps used only by local db scripts — keep Turbopack/Webpack from parsing them
  serverExternalPackages: [
    "@imgly/background-removal-node",
    "onnxruntime-node",
    "sharp",
    "esbuild",
    "drizzle-kit",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cashingtech.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
