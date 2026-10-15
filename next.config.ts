import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@react-email/components"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.instantdb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
