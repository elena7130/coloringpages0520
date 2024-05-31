// Hero.tsx
import Image from 'next/image';
import Link from 'next/link';

const HeroSection= () => {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Create your own coloring page in under a minute
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Sign up and get three free chances to use AI generate high-definition downloadable coloring pages.Come and try it!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-pink-400 px-8 text- font-blod text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="/sign-in"
                >
                  Get start for free
                </Link>
              </div>
            </div>
            <Image
              src="/hero.png"
              width={700}
              height={310}
              alt="hero image"
              className="w-full h-auto mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* The other sections would follow a similar structure, broken into different parts or components as needed. */}
    </>
  );
};

export default HeroSection;
