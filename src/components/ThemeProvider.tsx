'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
