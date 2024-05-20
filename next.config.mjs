/** @type {import('next').NextConfig} 
const nextConfig = {};

export default nextConfig;*/


import withMDX from '@next/mdx';

const withMDXConfig = withMDX({
  extension: /\.mdx?$/
});

export default withMDXConfig({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coloring-sav3-0520.s3.us-east-2.amazonaws.com',
        port: '',  // 通常S3 URL不需要指定端口
        pathname: '/**',  // 允许从此存储桶的任何子路径加载图片
      },
    ],
  },
});


