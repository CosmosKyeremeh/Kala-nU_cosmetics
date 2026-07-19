import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Lets the admin product form fall back to pasting an external image
    // URL when local-disk upload isn't available (e.g. on Vercel).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
