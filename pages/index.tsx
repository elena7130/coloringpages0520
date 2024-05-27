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
        <title>Dragon Coloring Pages | Free Printable Coloring Sheets</title>
        <meta name="dragon coloring pages" content="Explore a world of dragons with our free printable dragon coloring pages. Suitable for children and adults alike." />
        <meta name="description" content="dragon coloring pages, free coloring pages, printable coloring sheets, children coloring pages" />
        <meta name="author" content="Dragon Coloring Pages" />
        <meta name="p:domain_verify" content="943448617fddeee563240c51a1978e56"/>
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
        <link rel="canonical" href="https://www.dragon-coloringpages.com/" />
        <script type="application/ld+json">
{JSON.stringify({
    "@context": "http://schema.org",
    "@type": "WebSite",
    "url": "https://www.dragon-coloringpages.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.dragon-coloringpages.com/search?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
})}
</script> 
      </Head>
      
      <Header />

      <main className="container mx-auto px-4 py-2">
        <div className="text-center mx-auto mx-8 my-12 ">
          <h1 className="text-3xl font-bold">Free Dragon Coloring Pages for Printable and Download</h1>
          <p className="py-4 px-16 mb-6" style={{ lineHeight: '1.75' }}>
            Welcome to your ultimate gateway to hours of engaging and creative fun Dragon Coloring Pages. 
            Our coloring page website is themed around dragons and offers two levels of difficulty: 
            easy and normal. The easy level is suitable for children aged 2 to 4, 
            while the normal level is designed for children aged 4 and up.&quot; {/* Change made here */}
            We believe that everyone deserves a chance to be creative, and it should be fun!
            All downloads are currently free, please enjoy!</p>
          <h2 className="text-2xl font-bold mt-6">Discover the Fun with Our Free Printable Dragon Coloring Pages</h2>
          <p className="py-4 px-16 mb-6" style={{ lineHeight: '1.75' }}>Whether you&apos;re a kid looking for {/* Change made here */}
          some weekend fun, a stressed adult looking for a creative outlet, 
          or a teacher seeking interesting education tools, 
          we have a variety of dragon coloring pages ready for you. 
          Dive into a wide selection of themes 
          from mythical dragons, cartoon dragons, dragons in nature, seasons, and much more.</p>
          <p  className="font-bold">You&apos;re only a click away from stepping into a world of color.</p> {/* Change made here */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map(({ slug, frontMatter }) => (
            <Link  className="shadow rounded-lg p-4 text-center block hover:bg-pink-200" key={slug} href={`/${slug}`} passHref> {/* 包裹整个卡片 */}
                <div className="flex justify-center">  
                <Image src={frontMatter.image} alt={frontMatter.title} width={300} height={400}  style={{ objectFit: 'cover' } }/>
                </div>
                <h2 className="font-bold mt-2">{frontMatter.title}</h2>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-6 text-center">Ultimate Guide to Leveraging Dragon Coloring Pages for Creative Endeavors 🐉✨</h2>
      <p >Welcome to the fascinating world of dragon coloring pages! 
I wish the dragon coloring pages offer a versatile canvas for exploring your artistic talents. Here’s how you can make the most of these mythical creatures in your art projects.</p>
<h2 className="text-xl font-bold mt-6">Choosing Your Dragon Coloring Pages 📄🖌</h2>
      <p>Start by selecting the right type of dragon coloring page that aligns with your project. For younger children, simple dragon coloring pages or cute dragon coloring pages might be the best to spark their interest. Adults might prefer more intricate designs like detailed dragon coloring pages or realistic dragon coloring pages. Sites offering free printable dragon coloring pages are perfect for getting a variety of designs without any cost</p>
      <h2 className="text-xl font-bold mt-6">Creative Projects Using Dragon Coloring Pages 🖼️</h2>
      <p>
Homemade Greeting Cards: Use portions of a colored dragon coloring sheet to create unique greeting cards. Add a personal message for birthdays, holidays, or special occasions.
Educational Tools: Use dragon coloring pages to teach children about mythology, different cultures’ perspectives on dragons, and the art of coloring.
Scrapbooking: Incorporate colored dragon images into a scrapbook as part of a fantasy-themed layout.
Party Decorations: Color and cut out dragons to use as decorations for a themed party, especially popular for children’s birthday parties.
Advanced Projects 🚀
Fabric Transfers: Transfer your colored dragon designs onto fabrics using transfer paper, creating custom t-shirts, bags, or cushions.
Mixed Media Art: Combine coloring with other materials like sequins, beads, or fabric for a mixed media masterpiece.
Digital Art: Scan your colored pages and use software to digitally enhance them, creating vibrant artworks or even animations.</p>
      <p>Remember, the key is to enjoy the process as you bring these majestic creatures to life with colors and creativity. Happy coloring! 🎉🖍️</p>
      
      
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
