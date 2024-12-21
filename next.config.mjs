/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
