import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { CanonicalUrl } from '@/components/seo/CanonicalUrl';
import { TickerStrip } from '@/components/layout/TickerStrip';
import { locales, type Locale } from '@/i18n/config';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.geowire.org'),
  title: 'GeoWire — Recession Intelligence Platform',
  description:
    'Real-time recession probability, economic indicators, and geopolitical risk intelligence.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%230a0a0f"/><polyline points="4,24 10,14 16,18 22,8 28,12" fill="none" stroke="%232979FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="12" r="2" fill="%23FF1744"/></svg>',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://basemaps.cartocdn.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0f" />
        <CanonicalUrl />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <TickerStrip />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
