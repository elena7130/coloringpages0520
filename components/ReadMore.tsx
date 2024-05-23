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
        <div className="read-more-section" style={{ marginTop: '20px' }}>
            <h3>Read More:</h3>
            {pages.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {pages.map(page => (
                        <div key={page.slug} className="mb-4">
                            <Link href={`/${page.slug}`}  className="block">
                                
                                    <Image
                                        src={page.frontMatter.image}
                                        alt={`Image for ${page.frontMatter.title}`}
                                        width={100}
                                        height={50}
                                        layout="responsive"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                    <h4 className="text-blue-500 hover:underline mt-2 font-bold">{page.frontMatter.title}</h4>
                                
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
