import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slugify';
import { Post, FrontMatter } from '../types';  // 调整路径以正确导入

export const getAllPosts = (): Post[] => {
  const files = fs.readdirSync(path.join('content'));

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
      tags: data.tags,
    };

    return {
      slug,
      frontMatter
    };
  });

  return posts;
};