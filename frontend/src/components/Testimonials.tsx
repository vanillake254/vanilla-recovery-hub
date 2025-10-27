'use client';

import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Mary Kamau',
    platform: 'Instagram',
    avatar: '👩🏾',
    rating: 5,
    text: "Got my Instagram back in 3 days! They walked me through everything step-by-step. The chatbot was so helpful, and when I needed human support, they responded in hours. Worth every shilling! 🙏",
  },
  {
    name: 'John Mwangi',
    platform: 'Gmail',
    avatar: '👨🏾',
    rating: 5,
    text: "I thought my Gmail was gone forever after hackers changed everything. The Vanilla team helped me through the identity verification process and I got it back! The 2FA setup help was a bonus.",
  },
  {
    name: 'Sarah Wanjiru',
    platform: 'Facebook',
    avatar: '👩🏾‍💼',
    rating: 5,
    text: "Professional and patient service. My Facebook business page was hacked and I was losing customers. They recovered it in less than a week and secured it properly. Highly recommend the Premium tier!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who got their accounts back
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow">
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial */}
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">Recovered: {testimonial.platform}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Accounts Recovered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.8/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">24h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
