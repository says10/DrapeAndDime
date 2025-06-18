"use client";

import { useEffect, useState, ReactNode } from "react";

interface ScrollEffectsWrapperProps {
  children: ReactNode;
  scrollThreshold: number;
}

export default function ScrollEffectsWrapper({ children, scrollThreshold }: ScrollEffectsWrapperProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRaised = scrollY > scrollThreshold;

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isRaised ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-90'
      }`}
      style={{
        transform: isRaised ? 'translateY(0) scale(1.02)' : 'translateY(8px) scale(1)',
        boxShadow: isRaised ? '0 20px 40px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
} 