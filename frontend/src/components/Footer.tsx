'use client';

import Link from 'next/link';
import { FiMapPin, FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FiShield className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">
                Vanilla Recovery Hub
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Professional account recovery services. Get your digital life back quickly and securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#how-it-works" className="hover:text-primary-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary-400 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/recover" className="hover:text-primary-400 transition">
                  Start Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary-400 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FiMapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">Nairobi, Kenya</div>
                  <div className="text-gray-400 mt-1">Open 24/7</div>
                  <div className="text-primary-400 text-xs mt-1">Always available to help</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Vanilla Recovery Hub. All rights reserved.
          </p>
          <p className="text-gray-500 mt-4 md:mt-0">
            🔒 Secured by IntaSend | Made with ❤️ in Kenya | Powered by{' '}
            <a 
              href="https://vanillasoftwares.web.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-semibold"
            >
              Vanilla Softwares
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
