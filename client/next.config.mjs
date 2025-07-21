/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://innovation-marketplace-840370620772.us-central1.run.app ',
      },
    ];
  },
};

export default nextConfig;
