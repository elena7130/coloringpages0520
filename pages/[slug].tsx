import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { slugify } from '../utils/slugify';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReadMore from '../components/ReadMore';  // 引入 ReadMore 组件

interface PostProps {
  source: MDXRemoteSerializeResult;
  frontMatter: {
    title: string;
    date: string;
    image: string;
    tags: string[];
  };
}

interface RelatedPage {
  slug: string;
  frontMatter: {
    title: string;
    image: string;
  };
}

const PostPage = ({ source, frontMatter }: PostProps) => {
  const [relatedPages, setRelatedPages] = useState<RelatedPage[]>([]);
  const router = useRouter();
  const { slug } = router.query;

  const fetchRelatedPages = async (slug: string) => {
    try {
      const res = await fetch(`/api/related?slug=${slug}`);
      if (!res.ok) {
        throw new Error('Failed to fetch related pages');
      }
      const data: RelatedPage[] = await res.json();
      console.log('Fetched related pages data:', data);  // 添加日志以查看获取的数据
      setRelatedPages(data);
    } catch (error) {
      console.error("Error fetching related pages:", error);
      setRelatedPages([]);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchRelatedPages(slug as string);
    }
  }, [slug]);

  // 用于下载PDF的函数
  const downloadPDF = async () => {
    const response = await fetch(`/api/generate-pdf?imageUrl=${encodeURIComponent(frontMatter.image)}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${frontMatter.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } else {
      alert('Failed to download PDF');
    }
  };

  return (
    <>
      <Head>
        <title>{frontMatter.title} - Dragon Coloring Pages</title>
        <meta name="description" content={`Learn more about ${frontMatter.title} on our Dragon Coloring Pages.`} />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="bg-white shadow-lg rounded-lg p-5 my-5 pr-24" style={{ fontSize: '19px', lineHeight: '2.25' }}>
          <h1 className="text-2xl font-bold mb-6">{frontMatter.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4 ">
            {frontMatter.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <p className="text-gray-500 mb-8 test-2xl">{new Date(frontMatter.date).toLocaleDateString()}</p>
          <Image
            src={frontMatter.image}
            alt={`Coloring page for ${frontMatter.title}`}
            width={350}
            height={200}
            layout="intrinsic"
            quality={10} // 设置图像质量
            loading="lazy" // 懒加载
          />
          <button onClick={downloadPDF} className="mt-4 inline-block bg-gradient-to-r from-pink-300 via-pink-400 to-cyan-300 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
            Download PDF
          </button>
          <MDXRemote {...source} />
        </article>

        <ReadMore pages={relatedPages} /> {/* 使用 ReadMore 组件 */}
        
      </main>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('content'));
  const paths = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8');
    const { data: frontMatter } = matter(markdownWithMeta);
    return { params: { slug: slugify(frontMatter.title) } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const files = fs.readdirSync(path.join('content'));
    let matchedFile = '';

    for (const filename of files) {
      const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8');
      const { data: frontMatter } = matter(markdownWithMeta);
      if (slugify(frontMatter.title) === params?.slug) {
        matchedFile = filename;
        break;
      }
    }

    if (!matchedFile) {
      console.error('Matched file not found for slug:', params?.slug);
      return { notFound: true };
    }

    const markdownWithMeta = fs.readFileSync(path.join('content', matchedFile), 'utf-8');
    const { data: frontMatter, content } = matter(markdownWithMeta);
    const mdxSource = await serialize(content);

    return {
      props: {
        source: mdxSource,
        frontMatter
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
};

export default PostPage;
