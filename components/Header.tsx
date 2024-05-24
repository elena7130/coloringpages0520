// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import TwitterIcon from './TwitterIcon';
import PinterestIcon from './PinterestIcon';


const Header = () => {
    return (
        <header className="bg-gradient-to-r from-pink-300 via-pink-400 to-cyan-300 text-black py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <nav className="flex items-center space-x-4">
                    <Image
                        src="/favicon1.ico"
                        alt="Dragon Coloring Pages Logo"
                        width={70}
                        height={70}
                        quality={100}
                    />
                    <Link href="/" aria-label="Homepage" className="text-lg font-bold">
                        Dragon Coloring Pages
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <TwitterIcon />
                    <PinterestIcon />
                     {/* 添加 Ko-fi 图片链接作为捐款按钮 */}
                     <Link href='https://ko-fi.com/F2F3Y68DI' target='_blank' rel="noopener noreferrer">
                        <Image
                            height='36'
                            style={{ border: '0px', height: '36px' }}
                            src='https://storage.ko-fi.com/cdn/kofi2.png?v=3'
                            alt='Buy Me a Coffee at ko-fi.com'
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
