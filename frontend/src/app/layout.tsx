import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vanilla Recovery Hub - Professional Account Recovery Services',
  description: 'Recover your hacked or locked social media and email accounts. Expert guidance for Facebook, Instagram, Gmail, TikTok, and more.',
  keywords: 'account recovery, hacked account, social media recovery, Instagram recovery, Facebook recovery, Gmail recovery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatWidget />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
