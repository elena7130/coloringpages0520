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
  const environments = {
    development: 'http://localhost:3000',
    production: 'https://dragon-coloringpages.com',
    test: 'http://localhost:3000' // 假设你有一个名为'test'的环境
  };
  const environment = process.env.NODE_ENV as keyof typeof environments;
  const baseUrl = environments[environment] || 'https://dragon-coloringpages.com';

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