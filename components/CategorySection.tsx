// components/CategorySection.tsx
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    image: string;
    tags: string[];
  };
}

interface CategorySectionProps {
  title: string;
  posts: Post[];
}

const CategorySection = ({ title, posts }: CategorySectionProps) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const filteredPosts = selectedTag ? posts.filter(post => post.frontMatter.tags.includes(selectedTag)) : posts;

  const tagCounts = posts.reduce((acc: { [key: string]: number }, post) => {
    post.frontMatter.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* 更新标签排版 */}
      <div className="flex flex-wrap mb-4">  {/* 添加 flex-wrap 类 */}
        {Object.keys(tagCounts).map(tag => (
          <button key={tag} onClick={() => handleTagClick(tag)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded">
            {tag} ({tagCounts[tag]})
          </button>
        ))}
        <button onClick={() => setSelectedTag(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 m-2 rounded">
          Show All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {filteredPosts.map(({ slug, frontMatter }) => (
          <Link key={slug} href={`/${slug}`} passHref>
            <div className="shadow rounded-lg p-4 text-center block hover:bg-pink-200">
              <div className="flex justify-center">
                <Image src={frontMatter.image} alt={frontMatter.title} width={300} height={400} style={{ objectFit: 'cover' }} />
              </div>
              <h2 className="font-bold mt-2">{frontMatter.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
