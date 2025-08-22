import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/lib/locale-context';
import { type Locale } from '@/lib/translations';

// Validate locale parameter
const locales: Locale[] = ['en', 'uz', 'ru'];

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the locale is supported
  if (!locales.includes(params.locale as Locale)) {
    notFound();
  }

  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
