// @ts-check
import withMDX from '@next/mdx';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coloring-sav3-0520.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.ko-fi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'test-aicolor-0426.s3.us-east-2.amazonaws.com', // 新增域名
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    if (isProduction) {
      return [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap.xml',
          permanent: true,
        },
        {
          source: '/',
          destination: 'https://www.dragon-coloringpages.com/',
          permanent: true,
          basePath: false,
        },
      ];
    }
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,
      }
    ];
  },
};

const withMDXConfig = withMDX({
  extension: /\.mdx?$/
});

export default withMDXConfig(nextConfig);
