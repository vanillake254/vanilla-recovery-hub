'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiShield } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FiShield className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              Vanilla <span className="text-primary-600">Recovery Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition">
              How It Works
            </Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </Link>
            <Link href="/#faq" className="text-gray-700 hover:text-primary-600 transition">
              FAQ
            </Link>
            <Link href="/recover" className="btn btn-primary">
              Start Recovery
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/#how-it-works"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/recover"
              className="block btn btn-primary w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Recovery
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
