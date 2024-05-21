// types/index.ts

// FrontMatter 接口定义
export interface FrontMatter {
    title: string;
    date: string;
    image?: string;
    tags?: string[];
  }
  
  // Post 接口定义
  export interface Post {
    slug: string;
    frontMatter: FrontMatter;
  }
  