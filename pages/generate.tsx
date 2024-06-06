import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import GenerateImagePage from '../components/GenerateImagePage'; // 请确保这个路径正确
import Head from 'next/head';

const GeneratePage = () => (
  <>
    <Head>
      <title>Generate AI Coloring Pages - AI Coloring Pages Generator</title>
      <meta name="description" content="Generate your own AI coloring pages with our advanced generator. Sign in to create, download, and enjoy custom coloring pages for free." />
      <link rel="canonical" href="https://wwww.dragon-coloringpages.com/generate" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Generate AI Coloring Pages",
          "description": "Generate your own AI coloring pages with our advanced generator. Sign in to create, download, and enjoy custom coloring pages for free.",
          "url": "https://wwww.dragon-coloringpages.com/generate",
          "mainEntity": {
            "@type": "Article",
            "headline": "Generate AI Coloring Pages",
            "description": "Learn how to generate AI coloring pages with our advanced tool.",
            "url": "https://wwww.dragon-coloringpages.com/generate",
            "author": {
              "@type": "Person",
              "name": "Elena"
            },
            "publisher": {
              "@type": "Organization",
              "name": "https://wwww.dragon-coloringpages.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.dragon-coloringpages.com/favicon.ico"
              }
            },
            "image": "https://www.dragon-coloringpages.com/image1.png",
            "articleBody": "To start generating your own AI coloring pages, visit our [AI Coloring Pages Generator](https://www.dragon-coloringpages.com/generate). Sign in to create, download, and enjoy custom coloring pages for free."
          }
        })}
      </script>
    </Head>
    <SignedIn>
      <GenerateImagePage />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default GeneratePage;
