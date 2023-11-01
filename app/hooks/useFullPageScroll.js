"use client"

import { useRef, useEffect } from "react";

const useFullPageScroll = (sections) => {
  const sectionRefs = sections.map(() => useRef(null));

  useEffect(() => {
    const handleScroll = (e) => {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Find the next section based on the scroll direction
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentSectionIndex = sectionRefs.findIndex(
        (ref) => ref.current.offsetTop === scrollY
      );
      const nextSectionIndex = currentSectionIndex + direction;

      // Scroll to the next section if exists
      if (sectionRefs[nextSectionIndex]) {
        sectionRefs[nextSectionIndex].current.scrollIntoView({ behavior: "smooth" });
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return sectionRefs;
};

export default useFullPageScroll;
