// components/Footer.tsx
import TwitterIcon from './TwitterIcon';
import PinterestIcon from './PinterestIcon';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-white py-6 mt-10" style={{ background: 'linear-gradient(to right, #ff7eb3, #ff65a3, #7afcff)' }}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <p>© 2024 Dragon Coloring Pages - All Rights Reserved</p>
        <div className="flex items-center space-x-4">
          <TwitterIcon />
          <PinterestIcon />
          <Link href='https://ko-fi.com/F2F3Y68DI' target='_blank' rel="noopener noreferrer">
            <Image
              height={120}
              width={150}
              src='/kofi2.png'
              alt='Buy Me a Coffee at ko-fi.com'
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
