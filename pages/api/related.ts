import { getAllPosts } from '../../utils/getAllPosts';  // 确保路径正确

export default function handler(req, res) {
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

  // 输出所有帖子的标签
  allPosts.forEach(post => {
    console.log(`Post slug: ${post.slug}, Tags: ${post.frontMatter.tags}`);
  });

  const relatedPosts = allPosts.filter(post => {
    const hasMatchingTags = Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.some(tag => currentPost.frontMatter.tags.includes(tag));
    console.log(`Checking post: ${post.slug}, hasMatchingTags: ${hasMatchingTags}`);
    return hasMatchingTags && post.slug !== slug;
  });

  console.log("Related posts found:", relatedPosts.length);  // 日志记录相关帖子的数量
  res.status(200).json(relatedPosts);
}
