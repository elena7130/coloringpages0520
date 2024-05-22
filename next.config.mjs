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
    ],
  },
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,  // 如果你确认这是永久性重定向，否则可以设置为false
      },
    ];
  },
};

const withMDXConfig = withMDX({
  extension: /\.mdx?$/
});

export default withMDXConfig(nextConfig);
