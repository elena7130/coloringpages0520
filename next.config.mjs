// @ts-check
import withMDX from '@next/mdx';

/** @type {import('next').NextConfig}
 *  Extends NextConfig with redirects configuration
 */
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
        hostname: 'test-aicolor-0426.s3.us-east-2.amazonaws.com', // æ°å¢åå
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,  // å¦æä½ ç¡®è®¤è¿æ¯æ°¸ä¹æ§éå®åï¼å¦åå¯ä»¥è®¾ç½®ä¸ºfalse
      },
    ];
  },
};

const withMDXConfig = withMDX({
  extension: /\.mdx?$/
});

export default withMDXConfig(nextConfig);
