import { en } from './en';
import { uz } from './uz';
import { ru } from './ru';

export type Locale = 'en' | 'uz' | 'ru';

export const translations = {
  en,
  uz,
  ru,
} as const;

export type TranslationKey = keyof typeof en;

// Utility function to get nested translation value
export function getTranslation(
  locale: Locale,
  key: string,
  fallback?: any,
  params?: Record<string, any>
): any {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }

  // Handle interpolation if value is a string and params are provided
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  }

  return value;
}

// Hook for using translations in components
export function useTranslation(locale: Locale) {
  return {
    t: (key: string, fallback?: any, params?: Record<string, any>) => getTranslation(locale, key, fallback, params),
    locale,
    translations: translations[locale],
  };
}

// Language names for display
export const languageNames = {
  en: 'English',
  uz: 'O\'zbekcha',
  ru: 'Русский',
} as const;

// Language flags (you can use emoji flags or import flag icons)
export const languageFlags = {
  en: '🇺🇸',
  uz: '🇺🇿',
  ru: '🇷🇺',
} as const;

export default translations;
