// components/CategorySection.tsx
import { useState } from 'react';
import ColoringPageCard from './ColoringPageCard';

interface Page {
  title: string;
  imageUrl: string;
  tags: string[]; // 确保传递标签数据
}

interface CategorySectionProps {
  title: string;
  pages: Page[];
}

const CategorySection = ({ title, pages }: CategorySectionProps) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const filteredPages = selectedTag ? pages.filter(page => page.tags.includes(selectedTag)) : pages;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* 显示可选标签 */}
      <div className="flex space-x-4 mb-4">
        {Array.from(new Set(pages.flatMap(page => page.tags))).map(tag => (
          <button key={tag} onClick={() => handleTagClick(tag)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {tag}
          </button>
        ))}
        <button onClick={() => setSelectedTag(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Show All
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredPages.map((page, index) => (
          <ColoringPageCard key={index} title={page.title} imageUrl={page.imageUrl} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
