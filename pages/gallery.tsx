import React from 'react';
import Header from '../components/Header';
import Image from 'next/image';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import pool from '../lib/db';
import { useRouter } from 'next/router';

interface ImageData {
  id: string;
  url: string;
  description: string;
  created_at: string;
}

interface GalleryProps {
  images: ImageData[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT id, url, description, created_at FROM images');
    const images = res.rows.map((image: any) => ({
      ...image,
      created_at: new Date(image.created_at).toISOString(), // 将 Date 对象转换为 ISO 字符串
    }));
    client.release();

    return {
      props: { images },
    };
  } catch (error) {
    console.error('Failed to load images:', error);
    return {
      props: { images: [] },
    };
  }
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const router = useRouter();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Gallery of AI Generated Coloring Pages",
    "itemListElement": images.map((img, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "ImageObject",
        "url": img.url,
        "name": img.description,
        "thumbnailUrl": img.url,
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Gallery of AI Generated Coloring Pages</title>
        <meta name="description" content="Explore our gallery of AI-generated coloring pages featuring various themes and styles. Download your favorite coloring pages for free." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <Header />
      <div className="grid grid-cols-5 gap-6 p-5 mt-10 mb-10 ml-40 mr-40">
        {images.length > 0 ? (
          images.map((img, index) => (
            <div
              key={index}
              className="border rounded overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/images/${img.id}`)}
            >
              <Image
                src={img.url}
                alt={img.description}
                className="w-full"
                width={200}
                height={200}
              />
              <div className="p-4">
                <p className="text-l text-gray-700 font-bold">{img.description}</p>
                {/*<a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf?imageUrl=${encodeURIComponent(img.url)}`}
                  download={`Image-${index}.pdf`}
                  className="font-bold underline hover:text-blue-700 transition-colors"
                >
                  Download PDF
                </a>*/}
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-red-500">No images found.</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
