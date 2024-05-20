// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import TwitterIcon from './TwitterIcon';
import PinterestIcon from './PinterestIcon';

const Header = () => {
    return (
        <header className="text-black py-4" style={{ background: 'linear-gradient(to right, #ff7eb3, #ff65a3, #7afcff)' }}>
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="text-lg font-bold flex items-center space-x-4">
                <Image
                        src="/favicon1.ico"  // 使用 public 目录下的 logo 文件
                        alt="Logo"
                        width={70}  // 设置 logo 的宽度
                        height={70}  // 设置 logo 的高度
                    />
                    <Link href="/">
                        Dragon Coloring Pages
                    </Link>
                </div>
                <div className="flex items-center space-x-4" style={{ marginRight: '20px' }}>
                    <TwitterIcon />
                    <PinterestIcon />
                </div>
 
            </div>
        </header>
    );
};

export default Header;
