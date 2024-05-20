// components/ColoringPageCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '../utils/slugify';  // 确保从正确的位置导入 slugify 函数

interface ColoringPageCardProps {
  title: string;
  imageUrl: string;
}

const ColoringPageCard = ({ title, imageUrl }: ColoringPageCardProps) => {
  const slug = slugify(title);  // 使用 slugify 函数生成 slug

  return (
    <Link href={`/path/${slug}`} passHref>  
      <div className="border rounded-lg overflow-hidden shadow-lg cursor-pointer"> 
        <Image src={imageUrl} alt={title} width={300} height={400} objectFit="cover" />
        <div className="p-4">
          <h3 className="font-bold text-center">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ColoringPageCard;
