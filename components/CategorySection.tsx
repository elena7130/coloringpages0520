// components/CategorySection.tsx
import ColoringPageCard from './ColoringPageCard';

interface CategorySectionProps {
  title: string;
  pages: { title: string; imageUrl: string }[];
}

const CategorySection = ({ title, pages }: CategorySectionProps) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {pages.map((page, index) => (
          <ColoringPageCard key={index} title={page.title} imageUrl={page.imageUrl} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
