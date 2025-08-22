'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { languageNames, languageFlags, type Locale } from '@/lib/translations';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export default function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const locales: Locale[] = ['en', 'uz', 'ru'];

  const handleLanguageChange = (locale: Locale) => {
    setIsOpen(false);
    
    // Remove current locale from pathname if it exists
    const pathWithoutLocale = pathname.replace(/^\/(en|uz|ru)/, '') || '/';
    
    // Navigate to new locale
    const newPath = locale === 'en' ? pathWithoutLocale : `/${locale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languageFlags[currentLocale]} {languageNames[currentLocale]}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-blue-900 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 z-50">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors ${
                  locale === currentLocale 
                    ? 'bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200' 
                    : 'text-blue-700 dark:text-blue-200'
                }`}
              >
                <span className="text-lg">{languageFlags[locale]}</span>
                <span className="text-sm font-medium">{languageNames[locale]}</span>
                {locale === currentLocale && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-300 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
