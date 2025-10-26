'use client';

import Link from 'next/link';
import { FiCheck, FiStar } from 'react-icons/fi';

const tiers = [
  {
    name: 'Basic Recovery',
    price: '2,000',
    popular: false,
    features: [
      'Platform-specific recovery guide',
      'Email support',
      'Chat support for questions',
      'Security checklist PDF',
      'Email instructions',
      '48-hour response time',
    ],
    cta: 'Choose Basic',
    href: '/recover?tier=basic',
  },
  {
    name: 'Premium Recovery',
    price: '3,000',
    popular: true,
    features: [
      'Everything in Basic, PLUS:',
      'Priority 12-hour response',
      'Done-for-you assistance',
      'Screen-share support session',
      '2FA setup help',
      '7-day follow-up support',
      'Direct phone support',
      'Account security audit',
    ],
    cta: 'Choose Premium',
    href: '/recover?tier=premium',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No hidden fees. Pay once and get full support until your account is recovered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`card relative ${
                tier.popular
                  ? 'border-2 border-primary-500 shadow-2xl scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FiStar className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-5xl font-bold text-primary-600">
                    KES {tier.price}
                  </span>
                </div>
                <p className="text-gray-500 mt-2">One-time payment</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`btn w-full ${
                  tier.popular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-4">
            <p className="text-green-800 font-semibold">
              💯 Money-Back Guarantee
            </p>
            <p className="text-green-700 text-sm mt-1">
              Full refund if we don't respond within 48 hours or can't help with your case
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
