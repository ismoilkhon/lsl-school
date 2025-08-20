/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { protocol: "https", hostname: "syd.cloud.appwrite.io" },
      { protocol: "https", hostname: "cloud.appwrite.io" },
    ],
  },
};

export default nextConfig;
