import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '../../utils/getAllPosts';  // 确保路径正确

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  console.log("API received slug:", slug);  // 日志输出接收到的slug

  const allPosts = getAllPosts();
  console.log("Total posts found:", allPosts.length);  // 日志输出所有帖子的数量

  const currentPost = allPosts.find(post => post.slug === slug);
  console.log("Current post found:", currentPost);  // 日志输出找到的当前帖子

  if (!currentPost) {
    console.log("No post found for slug:", slug);  // 如果没有找到帖子，输出日志
    return res.status(404).json({ message: "Post not found" });
  }

  const currentPostTags = currentPost.frontMatter.tags;
  if (!Array.isArray(currentPostTags)) {
    console.log("Current post does not have tags:", slug);
    return res.status(200).json([]);  // 如果当前帖子没有标签，返回空数组
  }

  // 输出所有帖子的标签
  allPosts.forEach(post => {
    console.log(`Post slug: ${post.slug}, Tags: ${post.frontMatter.tags}`);
  });

  const relatedPosts = allPosts.filter(post => {
    if (!Array.isArray(post.frontMatter.tags)) {
      return false;
    }

    const hasMatchingTags = post.frontMatter.tags.some(tag => currentPostTags.includes(tag));
    console.log(`Checking post: ${post.slug}, hasMatchingTags: ${hasMatchingTags}`);
    return hasMatchingTags && post.slug !== slug;
  });

  console.log("Related posts found:", relatedPosts.length);  // 日志记录相关帖子的数量
  res.status(200).json(relatedPosts);
}
