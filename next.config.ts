import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  outputFileTracingRoot: path.resolve('.'),
  cacheComponents: true,
  images: {
    unoptimized: true,
    qualities: [75, 90],
  },
};

export default nextConfig;
