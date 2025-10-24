'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiMail, FiYoutube, FiTwitter } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6 animate-slide-up">
            <span className="text-primary-700 font-semibold text-sm">
              ✨ 500+ Accounts Recovered | 85% Success Rate
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Recover Your <span className="text-primary-600">Hacked Account</span> in Days
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Professional account recovery services for Facebook, Instagram, Gmail, TikTok, and more. 
            Get expert guidance and get your digital life back.
          </p>

          {/* Platform Icons */}
          <div className="flex justify-center items-center space-x-6 mb-10">
            <div className="flex items-center space-x-2">
              <FiFacebook className="w-8 h-8 text-blue-600" />
              <FiInstagram className="w-8 h-8 text-pink-600" />
              <FiMail className="w-8 h-8 text-red-600" />
              <SiTiktok className="w-8 h-8 text-gray-900" />
              <FiYoutube className="w-8 h-8 text-red-600" />
              <FiTwitter className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link href="/recover" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl">
              🚀 Start Recovery Now
            </Link>
            <Link href="/#how-it-works" className="btn btn-secondary text-lg px-8 py-4">
              📖 How It Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span>Fast Response</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💯</span>
              <span>No Password Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇰🇪</span>
              <span>M-Pesa Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
