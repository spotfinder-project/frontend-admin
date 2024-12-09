/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spotfinder-image.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "spotfinder-img.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
