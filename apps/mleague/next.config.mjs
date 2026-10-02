/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@mahjong-trainer/content-index-policy"],
  basePath: "/mleague",
  assetPrefix: "/mleague",
  trailingSlash: true
};

export default nextConfig;
