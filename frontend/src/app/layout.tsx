import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ChatWidget from '@/components/ChatWidget';
import StructuredData from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vanillarecoveryhub.web.app'),
  title: {
    default: 'Vanilla Recovery Hub - 95% Success Rate - Account Recovery Kenya',
    template: '%s | Vanilla Recovery Hub'
  },
  description: '🔒 Recover your hacked account! Professional recovery for Instagram, Facebook, Gmail, TikTok & more. 95% success rate ✓ 500+ recovered ✓ Secure payment via Flutterwave. From KES 2,000.',
  keywords: [
    'account recovery Kenya',
    'hacked account recovery',
    'Instagram recovery Kenya',
    'Facebook account recovery',
    'Gmail recovery service',
    'TikTok account recovery',
    'recover hacked Instagram',
    'recover hacked Facebook',
    'social media recovery Kenya',
    'email recovery service',
    'account recovery Nairobi',
    '95% success rate',
    'professional account recovery',
    'recover locked account',
    'recover stolen account',
    'WhatsApp recovery',
    'Twitter recovery',
    'account recovery expert',
    'Kenya account recovery service',
    'Flutterwave secure payment'
  ],
  authors: [{ name: 'Vanilla Recovery Hub' }],
  creator: 'Vanilla Recovery Hub',
  publisher: 'Vanilla Recovery Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#7C3AED',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sO1wpsS-zpMVNaubEYA1s7lvGP80svFjfLNBnBny0pY',
    yandex: 'your-yandex-verification-code',
  },
  category: 'Technology',
  classification: 'Account Recovery Service',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://vanillarecoveryhub.web.app',
    title: 'Vanilla Recovery Hub - 95% Success Rate ✓ Recover Your Hacked Account',
    description: '🔒 Professional account recovery for Instagram, Facebook, Gmail & more. 95% success rate ✓ 500+ accounts recovered ✓ From KES 2,000 ✓ Secure payment via Flutterwave.',
    siteName: 'Vanilla Recovery Hub',
    images: [
      {
        url: 'https://vanillarecoveryhub.web.app/og-image.svg?cache=v2024',
        width: 1200,
        height: 630,
        alt: 'Vanilla Recovery Hub - 95% Success Rate - Professional Account Recovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vanilla Recovery Hub - 95% Success Rate - Recover Your Hacked Account',
    description: '🔒 Professional account recovery services. 95% success rate ✓ Instagram, Facebook, Gmail, TikTok & more ✓ 500+ recovered.',
    images: ['https://vanillarecoveryhub.web.app/og-image.svg?cache=v2024'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vanilla Recovery',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <head>
        {/* Structured Data for SEO */}
        <StructuredData />
        
        {/* PWA & Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="canonical" href="https://vanillarecoveryhub.web.app" />
        
        {/* Theme & App Config */}
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vanilla Recovery" />
        
        {/* Additional SEO Tags */}
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics & Tracking */}
        <GoogleAnalytics />
        
        {/* Main Content */}
        {children}
        
        {/* Widgets */}
        <ChatWidget />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
