import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllPosts } from '../utils/getAllPosts';


interface HomeProps {
  posts: {
    slug: string;
    frontMatter: {
      title: string;
      date: string;
      image: string;
      tags: string[];
    };
  }[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Coloring Pages Website</title>
        <meta name="dragon coloring pages" content="Free printable dragon coloring pages for all ages" />
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
      </Head>
      
      <Header />

      <main className="container mx-auto px-4 py-2">
      <div className="text-center mx-auto mx-8 my-12 ">
          <h1 className="text-3xl font-bold">Free Dragon Coloring Pages for Printable</h1>
          <p className="py-4 px-16 mb-6" style={{ lineHeight: '1.75' }}>
            Welcome to your ultimate gateway to hours of engaging and creative fun Dragon Coloring Pages. 
            Our coloring page website is themed around dragons and offers two levels of difficulty: 
            easy and normal. The easy level is suitable for children aged 2 to 4, 
            while the normal level is designed for children aged 4 and up."
            We believe that everyone deserves a chance to be creative, and it should be fun!
            All downloads are currently free, please enjoy!</p>
          <h2 className="text-2xl font-bold mt-6">Discover the Fun with Our Free Printable Dragon Coloring Pages</h2>
          <p className="py-4 px-16 mb-6" style={{ lineHeight: '1.75' }}>Whether you're a kid looking for 
          some weekend fun, a stressed adult looking for a creative outlet, 
          or a teacher seeking interesting education tools, 
          we have a variety of dragon coloring pages ready for you. 
          Dive into a wide selection of themes 
          from mythical dragons, cartoon dragons, dragons in nature, seasons, and much more.</p>
          <p  className="font-bold">You're only a click away from stepping into a world of color.</p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map(({ slug, frontMatter }) => (
            <Link  className="shadow rounded-lg p-4 text-center block hover:bg-pink-200"       key={slug} href={`/${slug}`} passHref> {/* 包裹整个卡片 */}
                <div className="flex justify-center">  
                <Image src={frontMatter.image} alt={frontMatter.title} width={300} height={400}  style={{ objectFit: 'cover' } }/>
                </div>
                <h2 className="font-bold mt-2">{frontMatter.title}</h2>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts
    }
  };
};

export default Home;
