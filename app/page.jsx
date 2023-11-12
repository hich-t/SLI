"use client";

import styles from './page.module.css';
import LandingPage from "../pages/landingPage";
import SecondPage from "../pages/secondPage"; 
import ThirdPage from "../pages/thirdpage";
import { useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';


const Home = () => {
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const thirdSectionRef = useRef(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const sectionRefs = [firstSectionRef, secondSectionRef, thirdSectionRef];

  useEffect(() => {
    let startY;

    const handleTouchStart = (e) => {
        startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        const endY = e.touches[0].clientY;
        const deltaY = endY - startY;

        e.preventDefault();

        if (!isScrolling) {
            setIsScrolling(true);

            if (deltaY < 0 && currentSection < sectionRefs.length - 1) { // Scrolling down
                const nextRect = sectionRefs[currentSection + 1].current.getBoundingClientRect();
                window.scrollTo({
                    top: window.pageYOffset + nextRect.top,
                    behavior: 'smooth'
                });
                setCurrentSection(currentSection + 1);
            } else if (deltaY > 0 && currentSection > 0) { // Scrolling up
                const prevRect = sectionRefs[currentSection - 1].current.getBoundingClientRect();
                window.scrollTo({
                    top: window.pageYOffset + prevRect.top,
                    behavior: 'smooth'
                });
                setCurrentSection(currentSection - 1);
            }

            setTimeout(() => {
                setIsScrolling(false);
            }, 1000);
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const deltaY = e.deltaY;

        if (!isScrolling) {
            setIsScrolling(true);

            if (deltaY > 0 && currentSection < sectionRefs.length - 1) {
                const nextRect = sectionRefs[currentSection + 1].current.getBoundingClientRect();
                window.scrollTo({
                    top: window.pageYOffset + nextRect.top,
                    behavior: 'smooth'
                });
                setCurrentSection(currentSection + 1);
            } else if (deltaY < 0 && currentSection > 0) {
                const prevRect = sectionRefs[currentSection - 1].current.getBoundingClientRect();
                window.scrollTo({
                    top: window.pageYOffset + prevRect.top,
                    behavior: 'smooth'
                });
                setCurrentSection(currentSection - 1);
            }

            setTimeout(() => {
                setIsScrolling(false);
            }, 1000);
        }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection, sectionRefs, isScrolling]);

  return (
    <main className={styles.main}>
      <div ref={firstSectionRef}>
        <LandingPage  
        quiSommesNousRef={secondSectionRef}
        uneQuestionRef={thirdSectionRef} />
      </div>

      <div ref={secondSectionRef}>
        <SecondPage />
      </div>

      <div ref={thirdSectionRef}>
        <ThirdPage />
      </div>
    </main>
  );
};

export default Home;