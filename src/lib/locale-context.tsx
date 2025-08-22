'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { type Locale } from './translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Extract locale from params or pathname on mount
  useEffect(() => {
    const currentLocale = (params?.locale as Locale) || 
                         pathname.match(/^\/(en|uz|ru)/)?.[1] as Locale || 
                         'en';
    
    if (['en', 'uz', 'ru'].includes(currentLocale)) {
      setLocaleState(currentLocale);
    }
    setIsLoading(false);
  }, [pathname, params]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Update URL to reflect new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|uz|ru)/, '') || '/';
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    
    if (newPath !== pathname) {
      router.push(newPath);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
