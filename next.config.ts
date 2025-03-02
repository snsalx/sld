import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.BASE_URL || "",
};

export default nextConfig;
