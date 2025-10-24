'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'How long does account recovery take?',
    answer: 'Simple cases (with email access) typically take 1-3 days. Complex cases (without email access or requiring identity verification) can take 5-14 days. Most recoveries are completed within a week.',
  },
  {
    question: 'Do you need my password?',
    answer: 'Absolutely NO! We will NEVER ask for your password. It\'s against our policy and unsafe. We guide you through resetting it yourself or offer screen-share support where YOU perform the actions while we guide you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, Visa, Mastercard, and all major credit/debit cards. All payments are processed securely through Flutterwave. Your financial information is never stored on our servers.',
  },
  {
    question: 'What if my account can\'t be recovered?',
    answer: 'If we determine upfront that recovery isn\'t possible, we won\'t charge you. If we fail to provide the promised service or don\'t respond within 48 hours, you get a full refund. However, if the platform permanently disabled your account for violations, recovery may not be possible, but we\'ll still try our best.',
  },
  {
    question: 'Which platforms do you support?',
    answer: 'We specialize in Facebook, Instagram, Gmail, TikTok, YouTube, Twitter/X, Snapchat, LinkedIn, Yahoo Mail, Outlook, WhatsApp Business, and Telegram. Even if your platform isn\'t listed, contact us - we can likely help!',
  },
  {
    question: 'Is my data safe with you?',
    answer: 'Yes! We never ask for passwords, never share your data with third parties, and never sell your information. Payment details are handled securely by Flutterwave. We only collect your name, email, and phone for service delivery.',
  },
  {
    question: 'What\'s the difference between Basic and Premium?',
    answer: 'Basic gives you email guidance and chat support. Premium includes everything in Basic PLUS priority response, done-for-you screen-share assistance, 2FA setup help, and 7 days of follow-up support. Premium is recommended for complex cases or if you\'re not tech-savvy.',
  },
  {
    question: 'Can I speak to a human if the chatbot doesn\'t help?',
    answer: 'Absolutely! Just say "I need human help" in the chat, and we\'ll escalate you to our support team. They typically respond within 2 hours during business hours (Mon-Sat, 8 AM - 8 PM EAT).',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. Can't find what you're looking for? Chat with us!
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FiChevronUp className="w-6 h-6 text-primary-600 flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="mt-4 text-gray-600 animate-slide-up">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="btn btn-primary">
            💬 Chat With Us Now
          </button>
        </div>
      </div>
    </section>
  );
}
