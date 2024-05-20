// utils/slugify.ts

/**
 * 将字符串转换为SEO友好的URL slug。
 * @param title - 需要转换为slug的标题。
 * @return 转换后的slug。
 */
export const slugify = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};
  