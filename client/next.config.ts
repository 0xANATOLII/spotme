import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  devIndicators:false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Matches all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Matches all HTTP domains (optional)
      },
    ],
  },

};

export default nextConfig;
