import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './slugify';  // 确保引入 slugify 函数
import { Post } from '../types';  // 根据实际路径调整

export const getAllPosts = (): Post[] => {
  const files = fs.readdirSync(path.join('content'));

  const posts = files.map((filename): Post => {
    const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8');
    const { data } = matter(markdownWithMeta);
    const slug = slugify(data.title);  // 使用 slugify 处理标题生成 slug

    // 确保 frontMatter 包含所有必要的字段
    return {
      slug,
      frontMatter: {
        title: data.title,  // 从文件中解析得到的标题
        date: data.date,  // 从文件中解析得到的日期
        image: data.image,  // 从文件中解析得到的图像，如果有的话
        tags: data.tags  // 从文件中解析得到的标签数组，如果有的话
      }
    };
  });

  return posts;
};