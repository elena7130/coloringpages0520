import React from 'react';
import Header from '../components/Header'; // 确保这是你的头部组件的正确路径
import Image from 'next/image'; // 引入 Image 组件
import Head from 'next/head'; // 引入 Head 组件
import { GetServerSideProps } from 'next'; // 导入 GetServerSideProps 类型

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 使用环境变量
    const res = await fetch(`${apiUrl}/api/get-images`);
    if (!res.ok) {
      throw new Error(`Failed to fetch, received status ${res.status}`);
    }
    const images: ImageData[] = await res.json();

    // 确保返回的是数组
    if (!Array.isArray(images)) {
      throw new Error("Expected an array of images, but did not receive one.");
    }

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
            <div key={index} className="border rounded overflow-hidden shadow-lg">
              <Image
                src={img.url}
                alt={img.description}
                className="w-full"
                width={200}
                height={200}
              />
              <div className="p-4">
                <p className="text-sm text-gray-700">{img.description}</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf?imageUrl=${encodeURIComponent(img.url)}`}
                  download={`Image-${index}.pdf`}
                  className="font-bold underline hover:text-blue-700 transition-colors"
                >
                  Download PDF
                </a>
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
