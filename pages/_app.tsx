import '../styles/globals.css';
import type { AppProps } from 'next/app';
import GoogleAnalytics from '../components/GoogleAnalytics'

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <>
  <GoogleAnalytics />
  <Component {...pageProps} />;
  </>
    )
  }

export default MyApp;



