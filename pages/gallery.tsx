import React from 'react';
import Header from '../components/Header'; // 你的头部组件路径
import Image from 'next/image'; // 引入 Image 组件
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
    // 调用API获取图像数据
    const res = await fetch('http://localhost:3000/api/get-images');
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
    // 在开发中打印错误到控制台
    console.error('Failed to load images:', error);
    // 返回空数组避免页面错误
    return {
      props: { images: [] },
    };
  }
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-5 gap-6 p-5 mt-10 mb-10 ml-40 mr-40">
        {images.length > 0 ? (
          images.map((img, index) => (
            <div key={index} className="border rounded overflow-hidden shadow-lg">
              <Image
                src={img.url}
                alt="Generated Image"
                className="w-full"
                width={200}
                height={200}
              />
              <div className="p-4">
                <p className="text-sm text-gray-700">{img.description}</p>
                <a
                  href={`http://localhost:3000/api/generate-pdf?imageUrl=${encodeURIComponent(
                    img.url
                  )}`}
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
