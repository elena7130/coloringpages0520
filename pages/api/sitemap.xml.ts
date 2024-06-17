import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '../../utils/getAllPosts';
import pool from '../../lib/db';

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
  };
}

interface ImageData {
  id: string;
  url: string;
  description: string;
  created_at: string;
}

const additionalPages = [
  { url: 'https://www.dragon-coloringpages.com/', lastmod: new Date().toISOString(), priority: 1.0 },
  { url: 'https://www.dragon-coloringpages.com/sign-in', lastmod: new Date().toISOString(), priority: 0.8 },
  { url: 'https://www.dragon-coloringpages.com/generate', lastmod: new Date().toISOString(), priority: 0.8 },
  { url: 'https://www.dragon-coloringpages.com/gallery', lastmod: new Date().toISOString(), priority: 0.8 },
];

async function getGalleryImages() {
  const client = await pool.connect();
  const res = await client.query('SELECT id, url, created_at FROM images');
  const images: ImageData[] = res.rows.map((image: any) => ({
    ...image,
    created_at: new Date(image.created_at).toISOString(),
  }));
  client.release();
  return images;
}

export default async function sitemapXml(req: NextApiRequest, res: NextApiResponse) {
  const posts: Post[] = getAllPosts();
  const environments = {
    development: 'http://localhost:3000',
    production: 'https://www.dragon-coloringpages.com',
    test: 'http://localhost:3000'
  };
  const environment = process.env.NODE_ENV as keyof typeof environments;
  const baseUrl = environments[environment] || 'https://www.dragon-coloringpages.com';

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/${post.slug}`,
    lastmod: new Date(post.frontMatter.date).toISOString(),
    priority: 0.7,
  }));

  const galleryImages = await getGalleryImages();
  const galleryUrls = galleryImages.map(image => ({
    url: `${baseUrl}/images/${image.id}`,
    lastmod: image.created_at,
    priority: 0.5,
  }));

  const allUrls = [...postUrls, ...additionalPages, ...galleryUrls];

  const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
