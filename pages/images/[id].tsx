import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import pool from '../../lib/db';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface ImageDetailProps {
  image: {
    id: string;
    url: string;
    description: string;
    created_at: string;
  };
  relatedImages: {
    id: string;
    url: string;
    description: string;
    created_at: string;
  }[];
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT id, url, description, created_at FROM images WHERE id = $1', [id]);
    const image = res.rows[0];

    if (!image) {
      client.release();
      return {
        notFound: true,
      };
    }

    // 分割 description 成为单词列表
    const descriptionWords = image.description.split(' ').filter((word: string) => word.length > 0);
    const queryParams = [id, ...descriptionWords.map((word: string) => `%${word}%`)];

    // 生成查询条件字符串
    const queryPlaceholders = descriptionWords.map((_: string, index: number) => `$${index + 2}`).join(', ');

    // 查找相关图片
    const relatedRes = await client.query(`
      SELECT id, url, description, created_at
      FROM images
      WHERE id != $1 AND description ILIKE ANY (ARRAY[${queryPlaceholders}])
      LIMIT 4
    `, queryParams);

    let relatedImages = relatedRes.rows;

    // 如果没有找到相关图片，显示最近更新的图片
    if (relatedImages.length === 0) {
      const recentRes = await client.query(`
        SELECT id, url, description, created_at
        FROM images
        WHERE id != $1
        ORDER BY created_at DESC
        LIMIT 4
      `, [id]);
      relatedImages = recentRes.rows;
    }

    client.release();

    // 将 Date 对象转换为 ISO 字符串
    image.created_at = new Date(image.created_at).toISOString();
    relatedImages.forEach((img: any) => img.created_at = new Date(img.created_at).toISOString());

    return {
      props: { image, relatedImages },
    };
  } catch (error) {
    console.error('Failed to load image:', error);
    return {
      notFound: true,
    };
  }
};

const ImageDetail: React.FC<ImageDetailProps> = ({ image, relatedImages }) => {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000); // 显示2秒后消失
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{image.description}</title>
        <meta name="description" content={image.description} />
      </Head>
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-4xl flex flex-col md:flex-row mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 flex justify-center items-center mb-6 md:mb-0">
            <Image
              src={image.url}
              alt={image.description}
              className="rounded"
              width={500}
              height={500}
              objectFit="cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 relative">
            <button
              onClick={() => router.push('/generate')}
              className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-2 rounded mt-4"
            >
              Generate
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 mt-12">{image.description}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-600">Style</label>
              <div className="bg-gray-100 p-2 rounded text-gray-800">{image.description}</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-600">Prompt</label>
              <div className="bg-gray-100 p-2 rounded text-gray-800">{image.description}</div>
            </div>
            <div className="mb-4 flex items-center">
              <div className="flex-grow bg-gray-100 p-2 rounded text-gray-800 flex items-center">
                <span className="flex-grow">{url}</span>
                <button onClick={handleCopyUrl} className="ml-2 bg-gray-200 p-1 rounded">Copy</button>
                {copySuccess && <span className="ml-2 text-green-500">{copySuccess}</span>}
              </div>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/generate-pdf?imageUrl=${encodeURIComponent(image.url)}`}
              download="Image.pdf"
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Download PDF
            </a>
   
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mt-10 mx-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Related Coloring Pages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedImages.length > 0 ? (
            relatedImages.map((img) => (
              <div key={img.id} className="border rounded overflow-hidden shadow-lg cursor-pointer">
                <Image
                  src={img.url}
                  alt={img.description}
                  className="w-full"
                  width={200}
                  height={200}
                />
                <div className="p-4">
                  <p className="text-sm text-gray-700">{img.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No related images found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ImageDetail;
