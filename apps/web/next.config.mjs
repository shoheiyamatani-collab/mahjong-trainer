/** @type {import('next').NextConfig} */
const isCloudflarePages = process.env.CF_PAGES === "1";

const nextConfig = {
  transpilePackages: ["@mahjong-trainer/content-index-policy", "@mahjong-trainer/mahjong-core", "@mahjong-trainer/tenhou-analysis"],
  ...(isCloudflarePages ? { output: "export" } : {})
};

export default nextConfig;
