import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignedIn, SignedOut, SignOutButton, useClerk } from '@clerk/nextjs';
import { useState } from 'react';

const Header = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isHoveredGenerate, setIsHoveredGenerate] = useState(false);
  const [isHoveredLogin, setIsHoveredLogin] = useState(false);
  const [isHoveredFree, setIsHoveredFree] = useState(false);
  const [isHoveredPrice, setIsHoveredPrice] = useState(false);

  const handleSignOut = () => {
    signOut().then(() => {
      window.location.href = '/';
    });
  };

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
        <div className="flex items-center space-x-5">
          <Link 
            href='/generate' 
            aria-label="AI Coloring Pages Generator" 
            className={`text-lg font-semibold px-4 py-2 ${isHoveredGenerate ? 'text-gray-500' : ''}`}
            onMouseEnter={() => setIsHoveredGenerate(true)}
            onMouseLeave={() => setIsHoveredGenerate(false)}
          >
            AI Coloring Pages Generator
          </Link>
          <Link 
            href='/gallery' 
            aria-label="explore" 
            className={`text-lg font-semibold ${isHoveredFree ? 'text-gray-500' : ''}`}
            onMouseEnter={() => setIsHoveredFree(true)}
            onMouseLeave={() => setIsHoveredFree(false)}
          >
            Explore
          </Link>
          {/*
          <Link 
            href='/[slug]' 
            aria-label="Free Coloring Pages" 
            className={`text-lg font-semibold ${isHoveredFree ? 'text-gray-500' : ''}`}
            onMouseEnter={() => setIsHoveredFree(true)}
            onMouseLeave={() => setIsHoveredFree(false)}
          >
            Free Coloring Pages
          </Link>

  
          <Link 
            href='/price' 
            aria-label="Price" 
            className={`text-lg font-semibold ${isHoveredPrice ? 'text-gray-500' : ''}`}
            onMouseEnter={() => setIsHoveredPrice(true)}
            onMouseLeave={() => setIsHoveredPrice(false)}
          >
            Price
          </Link>*/}
        </div>
        <div className="flex items-center">
          <SignedIn>
            <div className="flex items-center space-x-4">
              <p>Welcome, enjoy color：</p>
              <span className="text-blue-500">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</span>
              <button onClick={handleSignOut} className="text-lg font-semibold px-4 py-2">
                Logout
              </button>
            </div>
          </SignedIn>
          <SignedOut>
            <Link 
              href='/sign-in' 
              aria-label="Login" 
              className={`text-lg font-semibold px-4 py-2 ${isHoveredLogin ? 'text-gray-500' : ''}`}
              onMouseEnter={() => setIsHoveredLogin(true)}
              onMouseLeave={() => setIsHoveredLogin(false)}
            >
              Login
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
