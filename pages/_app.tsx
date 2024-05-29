import '../styles/globals.css';
import type { AppProps } from 'next/app';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ClerkProvider } from '@clerk/nextjs';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canonicalUrl = (`https://www.dragon-coloringpages.com` + (router.asPath === "/" ? "" : router.asPath)).split("?")[0];

  return (
    <ClerkProvider>
      <GoogleAnalytics />
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
