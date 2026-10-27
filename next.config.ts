import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://stjmmlzykokwaqkushnu.supabase.co").hostname;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 2048],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      { source: "/our-work", destination: "/projecten", permanent: true },
      { source: "/en/our-work", destination: "/en/projecten", permanent: true },
      { source: "/diensten/batterijopslag", destination: "/diensten/thuisbatterij", permanent: true },
      { source: "/en/diensten/batterijopslag", destination: "/en/diensten/thuisbatterij", permanent: true },
      { source: "/diensten/renovaties", destination: "/diensten/verduurzaming", permanent: true },
      { source: "/en/diensten/renovaties", destination: "/en/diensten/verduurzaming", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
