// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '../../utils/getAllPosts';

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
  };
}

export default async function sitemapXml(req: NextApiRequest, res: NextApiResponse) {
  const posts: Post[] = getAllPosts();
  const baseUrl = {
    development: 'http://localhost:3000', // 开发环境的URL
    production: 'https://dragon-coloringpages.com', // 生产环境的URL，应根据实际情况更改
  }[process.env.NODE_ENV] || 'https://dragon-coloringpages.com';

  const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map(post => `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${new Date(post.frontMatter.date).toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>
`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
