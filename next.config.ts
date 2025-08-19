
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  devServer: {
    allowedDevOrigins: [
      "https://6000-firebase-studio-1755618594719.cluster-lqzyk3r5hzdcaqv6zwm7wv6pwa.cloudworkstations.dev",
    ],
  }
};

export default nextConfig;
