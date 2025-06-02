import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/news-page",
        permanent: false, // Set to true for 308 (permanent redirect)
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow all hostnames
      },
      {
        protocol: "http",
        hostname: "*", // Allow all hostnames
      },
    ],
  },
};

export default nextConfig;
