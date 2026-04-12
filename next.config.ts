import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.instantdb.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
