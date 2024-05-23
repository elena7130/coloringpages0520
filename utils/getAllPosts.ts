import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slugify';
import { Post, FrontMatter } from '../types';  // 调整路径以正确导入

export const getAllPosts = (): Post[] => {
  const files = fs.readdirSync(path.join(process.cwd(), 'content')); // 确保路径是从项目根目录开始的

  const posts = files.map((filename): Post => {
    const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8');
    const { data } = matter(markdownWithMeta);
    const slug = slugify(data.title);

    if (!data.title || typeof data.title !== 'string' || !data.date || typeof data.date !== 'string') {
      throw new Error(`Missing required front matter in ${filename}.`);
    }

    const frontMatter: FrontMatter = {
      title: data.title,
      date: data.date,
      image: data.image,  // 确保类型正确
      tags: data.tags || [],  // 确保 tags 是一个数组，即使未定义
    };

    return {
      slug,
      frontMatter
    };
  });

  return posts;
};

// 仅在开发模式下打印日志
if (process.env.NODE_ENV === 'development') {
  console.log("Posts data:", getAllPosts());
}
