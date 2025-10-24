'use client';

import { FiClipboard, FiCreditCard, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';

const steps = [
  {
    icon: FiClipboard,
    title: 'Submit Your Case',
    description: 'Tell us about your locked or hacked account. Our system analyzes your situation immediately.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: FiCreditCard,
    title: 'Secure Payment',
    description: 'Choose your tier and pay securely via M-Pesa or card. Get instant access to our recovery tools.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: FiMessageCircle,
    title: 'Expert Guidance',
    description: 'Receive platform-specific instructions and chat with our support team anytime you need help.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: FiCheckCircle,
    title: 'Account Restored',
    description: 'Follow our proven steps to regain access. We help you secure your account to prevent future hacks.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our proven 4-step process gets your account back quickly and securely
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="card hover:shadow-xl transition-shadow duration-300">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`${step.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/recover" className="btn btn-primary text-lg">
            Get Started Now →
          </a>
        </div>
      </div>
    </section>
  );
}
