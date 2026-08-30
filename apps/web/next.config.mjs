/** @type {import('next').NextConfig} */
const isCloudflarePages = process.env.CF_PAGES === "1";

const nextConfig = {
  transpilePackages: ["@mahjong-trainer/mahjong-core"],
  ...(isCloudflarePages
    ? { output: "export" }
    : {
        async redirects() {
          return [
            {
              source: "/",
              destination: "/analysis/mahjong-tool",
              permanent: false
            }
          ];
        }
      })
};

export default nextConfig;
