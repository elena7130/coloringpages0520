import '../styles/globals.css';
import type { AppProps } from 'next/app';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Head from 'next/head';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canonicalUrl = (`https://dragon-coloringpages.com` + (router.asPath === "/" ? "" : router.asPath)).split("?")[0];


  return (
  <>
  <GoogleAnalytics />
  <Head>
        <link rel="canonical" href={canonicalUrl} />
  </Head>
  <Component {...pageProps} />;
  </>
    )
  }

export default MyApp;



