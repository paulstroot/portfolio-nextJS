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
};

export default withFlowbiteReact(nextConfig);
