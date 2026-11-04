import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://stjmmlzykokwaqkushnu.supabase.co").hostname;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 2048, 2560],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    viewTransition: true,
    // Photos no longer pass through a Server Action (they go straight to Storage with a
    // signed URL), but content saves can be a few hundred kB of JSON. The 1 MB default
    // used to answer with a 413, which the router shows as "This page couldn't load".
    serverActions: { bodySizeLimit: "4mb" },
  },
  async redirects() {
    return [
      // The project showroom is gone: our work now lives in one Instagram profile.
      { source: "/our-work", destination: "/#instagram", permanent: true },
      { source: "/en/our-work", destination: "/en#instagram", permanent: true },
      { source: "/projecten", destination: "/#instagram", permanent: true },
      { source: "/en/projecten", destination: "/en#instagram", permanent: true },
      { source: "/projecten/:slug", destination: "/#instagram", permanent: true },
      { source: "/en/projecten/:slug", destination: "/en#instagram", permanent: true },
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
