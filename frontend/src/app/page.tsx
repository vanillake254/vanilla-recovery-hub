'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Hero from '@/components/Hero';
import PricingSection from '@/components/PricingSection';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vanilla Recovery Hub - Professional Account Recovery Services',
  description: 'Professional account recovery for Instagram, Facebook, Gmail & more. 95% success rate. From KES 2,000. Secure payment via Flutterwave.',
  openGraph: {
    title: 'Vanilla Recovery Hub - Recover Your Hacked Account',
    description: 'Professional account recovery for Instagram, Facebook, Gmail & more. 95% success rate. From KES 2,000.',
    images: [{
      url: 'https://vanillarecoveryhub.web.app/og-image.svg?v=2',
      width: 1200,
      height: 630,
    }],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
