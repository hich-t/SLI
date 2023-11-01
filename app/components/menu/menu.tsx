"use client"

import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Menu = () => {
  // State to control the mobile menu's visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <main className="font-noto-sans text-xl h-28 z-9999 flex items-center shadow-custom-red justify-between w-full bg-white text-red-400 top-0 px-6 sm:px-20">
        <div>
          <img className="w-28 ml-10" src="Assets/images/sli_logo.png" alt="logo sli" />
        </div>

        {/* Large Screen Layout */}
        <div className="hidden sm:flex">
          <p className="mr-12 font-normal">Qui Sommes Nous ?</p>
          <p className="font-normal">Une question ?</p>
        </div>

        <div className="hidden sm:flex">
          <AccountCircleIcon className="mr-2" />
          <p className="font-bold mr-20">Espace Client</p>
        </div>

        {/* Hamburger Icon for Mobile Layout */}
        <button 
          className="sm:hidden flex items-center px-3 py-2 border rounded"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="h-6 w-6 fill-maroc-red" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
      </main>

      {/* Mobile Menu Layout */}
      <nav className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} font-noto-sans font-bold bg-maroc-red w-full text-white px-6 py-3 fixed top-28`}>
        <a href="#" className="block mt-4">Qui Sommes Nous ?</a>
        <a href="#" className="mt-4 block">Une question ?</a>
        <span className="flex items-center"><AccountCircleIcon className="mr-2" /><a href="#" className="mt-4 block mb-4">Espace Client</a></span>
      </nav>
    </>
  );
};

export default Menu;
