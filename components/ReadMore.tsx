import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Page {
    slug: string;
    frontMatter: {
        title: string;
        image: string;
    };
}

interface ReadMoreProps {
    pages?: Page[];
}

const ReadMore: React.FC<ReadMoreProps> = ({ pages = [] }) => {
    console.log('ReadMore pages:', pages);
    return (
        <div className="read-more-section mt-8 px-8">
        <h3 className="text-3xl font-bold text-center mb-10">
            <span className="text-transparent  font-bold bg-clip-text bg-gradient-to-r from-pink-300 via-pink-400 to-cyan-300">
            Here are some more coloring pages for you to choose from
            </span>
        </h3>
            {pages.length > 0 ? (
                <div className="grid grid-cols-4 gap-8">
                    {pages.map(page => (
                        <div key={page.slug} className="mb-4">
                            <Link href={`/${page.slug}`}  className="block">
                                
                                    <Image
                                        src={page.frontMatter.image}
                                        alt={`Image for ${page.frontMatter.title}`}
                                        width={100} // 调整图片宽度
                                        height={150} // 调整图片高度
                                        layout="responsive"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                    <h4 className="text-blue-500 font-bold hover:underline mt-2">{page.frontMatter.title}</h4>
                                
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No related pages available.</p>
            )}
        </div>
    );
};

export default ReadMore;
