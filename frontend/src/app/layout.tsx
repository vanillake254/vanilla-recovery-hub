import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vanilla Recovery Hub - 95% Success Rate - Account Recovery',
  description: '🔒 Recover your hacked account! Professional recovery for Instagram, Facebook, Gmail, TikTok & more. 95% success rate ✓ 500+ recovered ✓ Secure payment via Flutterwave. From KES 2,000.',
  keywords: 'account recovery, hacked account, social media recovery, Instagram recovery, Facebook recovery, Gmail recovery, TikTok recovery, Kenya account recovery, 95% success rate',
  manifest: '/manifest.json',
  themeColor: '#7C3AED',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
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
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vanilla Recovery" />
      </head>
      <body className={inter.className}>
        {children}
        <ChatWidget />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
