declare module 'gray-matter' {
    interface MatterResult {
      data: any;
      content: string;
      isEmpty: boolean;
      excerpt?: string;
    }
  
    function matter(input: string, options?: any): MatterResult;
    export = matter;
  }
  