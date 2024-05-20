import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slugify';  // 确保引入slugify函数

export const getAllPosts = () => {
  const files = fs.readdirSync(path.join('content'));

  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8');
    const { data: frontMatter } = matter(markdownWithMeta);
    const slug = slugify(frontMatter.title); // 使用slugify处理标题生成slug

    return {
      slug,
      frontMatter
    };
  });

  return posts;
};
