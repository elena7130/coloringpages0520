// pages/404.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    // 在2秒钟后重定向到主页
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Page Not Found - Dragon Coloring Pages</title>
        <meta name="description" content="The page you are looking for does not exist. Redirecting to the homepage." />
      </Head>
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4">The page you are looking for does not exist. You will be redirected to the homepage in a few seconds.</p>
      </div>
    </>
  );
};

export default Custom404;
