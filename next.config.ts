import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net", // Replace with your image host
        port: "",
        pathname: "/**", // Adjust if you have a specific path
      },
    ],
  },
  // Security headers
  // Note: With static export (output: "export"), these headers won't be applied automatically.
  // You'll need to configure them at your hosting provider level (Vercel, Netlify, etc.)
  // or use middleware.ts if you switch away from static export.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // 'unsafe-eval' needed for Next.js dev/Turbopack, 'unsafe-inline' for Flowbite theme script
              "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Tailwind and Flowbite
              "img-src 'self' data: https://images.ctfassets.net", // Contentful images
              "font-src 'self' data:",
              "connect-src 'self' https://api.smtp2go.com", // SMTP2GO API for contact form
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
