// utils/slugify.ts

/**
 * 将字符串转换为SEO友好的URL slug。
 * @param title - 需要转换为slug的标题。
 * @return 转换后的slug。
 */
export const slugify = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};
  
// 测试slugify函数
console.log(slugify("Ice Cream Loving Dragon Coloring Page"));  // 预期输出: "ice-cream-loving-dragon-coloring-page"
console.log(slugify("Hello World! 123"));  // 预期输出: "hello-world-123"
console.log(slugify("测试@符号#和$特%符^"));  // 预期输出: "测试符号和特符"
