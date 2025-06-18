"use client";

import { useEffect, useState } from "react";

interface HydrationSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const HydrationSafe = ({ children, fallback = null }: HydrationSafeProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HydrationSafe; 