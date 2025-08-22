'use client';

import { useThemeStore } from '@/lib/theme-store';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        flex items-center justify-center
        transition-all duration-200
        hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-blue-900
        ${className}
        ${theme === 'dark' 
          ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={iconSizes[size]} />
      ) : (
        <Moon size={iconSizes[size]} />
      )}
    </button>
  );
}
