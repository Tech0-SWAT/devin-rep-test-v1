/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'aws-sdk': false,
        'mock-aws-s3': false,
        'nock': false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
