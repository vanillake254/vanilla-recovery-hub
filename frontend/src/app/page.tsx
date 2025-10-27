'use client';

import { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import PricingSection from '@/components/PricingSection';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
