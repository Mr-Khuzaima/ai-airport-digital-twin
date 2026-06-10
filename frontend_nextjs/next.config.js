/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei',
    'troika-three-text',
    'troika-worker-utils'
  ],
};

module.exports = nextConfig;
