import { useState, useRef } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';

const LandingPage = ({ quiSommesNousRef, uneQuestionRef }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full h-screen relative">
      {/* Background */}
      <div className="w-full h-full absolute">
        {/* Video for large screens */}
        <video
          className="hidden sm:block w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="Assets/video/SLI_videoBg.mp4" />
        </video>
        {/* Image for mobile screens */}
        <img
          className="sm:hidden w-full h-full object-cover"
          src="Assets/images/bg_mobile.png"
          alt="Mobile background"
        />
      </div>

      {/* Menu */}
      <div className="font-noto-sans text-xl h-28 z-9999 flex items-center shadow-custom-red justify-between w-full bg-white text-maroc-red absolute top-0 px-6 sm:px-20">
        <img className="w-28 ml-10" src="Assets/images/sli_logo.png" alt="logo sli" />

        {/* Large Screen Layout */}
        <div className="hidden sm:flex">
        <p className="mr-12 font-normal cursor-pointer" onClick={() => scrollToRef(quiSommesNousRef)}>Qui Sommes Nous ?</p>
        <p className="font-normal cursor-pointer" onClick={() => scrollToRef(uneQuestionRef)}>Une question ?</p>
        </div>

        <Link className="hidden sm:flex items-center cursor-pointer" href="/login">
          <AccountCircleIcon className="mr-2" />
          <p className="font-bold mr-20">Espace Client</p>
        </Link>

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
      </div>

      {/* Mobile Menu Layout */}
      <nav className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} font-noto-sans font-bold bg-maroc-red w-full text-white px-6 py-3 fixed top-28 z-20`}>
      <button role="link" className="block mt-4"   onClick={() => {
    scrollToRef(quiSommesNousRef);
    setIsMobileMenuOpen(false);
  }}
>
        Qui Sommes Nous ?</button>
<button role="link" className="mt-5 block"   onClick={() => {
    scrollToRef(uneQuestionRef);
    setIsMobileMenuOpen(false);
  }}>Une question ?</button>

        <Link href="/login" className="flex items-center mt-5 block mb-4">
          <AccountCircleIcon className="mr-2" />
          <span>Espace Client</span>
        </Link>
      </nav>

      {/* FirstPage Content for large screens */}
      <div className="hidden sm:flex text-white flex-col absolute top-[25%] left-[60%] animate-fadeIn">
        <img className="w-52 animate-fadeIn" src="Assets/images/sli_logo_seul.png" alt="logo sli" />
        <p 
  style={{
    textShadow: `0 0 8px #006233, 0 0 10px #006233`
}}
        className="font-noto-sans font-black text-white text-4xl mt-10 animate-fadeIn">
            Votre partenaire privilégié
        </p>
      </div>

      {/* FirstPage Content for mobile screens */}
      <div className="sm:hidden w-full text-white flex-col absolute top-[20%] z-10">
        <p className="font-noto-sans font-black text-white text-3xl text-center">
            Votre partenaire privilégié
        </p>
      </div>


      <div className="font-noto-sans text-[20px] text-white flex flex-col items-center left-1/2 absolute bottom-[15%] sm:bottom-[1%] transform -translate-x-1/2 sm:animate-blink">
  <p>Découvrez Nous</p>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
</div>

    </main>
  );
};

export default LandingPage;
