'use client';

export default function StructuredData() {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vanilla Recovery Hub",
    "alternateName": "Vanilla Account Recovery",
    "url": "https://vanillarecoveryhub.web.app",
    "logo": "https://vanillarecoveryhub.web.app/logo.svg",
    "description": "Professional account recovery services for hacked social media and email accounts. 95% success rate. Instagram, Facebook, Gmail, TikTok recovery experts in Kenya.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Nairobi"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Swahili"],
      "areaServed": "KE"
    },
    "sameAs": [
      "https://vanillarecoveryhub.web.app"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Account Recovery Service",
    "provider": {
      "@type": "Organization",
      "name": "Vanilla Recovery Hub"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Kenya"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Account Recovery Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Basic Account Recovery",
            "description": "Email guidance and chat support for account recovery with security checklist PDF and 24-hour response time"
          },
          "price": "2000",
          "priceCurrency": "KES"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Account Recovery",
            "description": "Done-for-you priority support with 12-hour response, 2FA setup help, and dedicated assistance"
          },
          "price": "3000",
          "priceCurrency": "KES"
        }
      ]
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "2000",
      "highPrice": "3000",
      "priceCurrency": "KES",
      "availability": "https://schema.org/InStock"
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does account recovery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most recoveries are completed within 3-7 days. Basic tier: 24h response, Premium: 12h response. Complex cases may take up to 14 days depending on platform response times."
        }
      },
      {
        "@type": "Question",
        "name": "What is your success rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We have a 95% success rate with over 500+ accounts recovered. Our expert team specializes in Instagram, Facebook, Gmail, TikTok, and other platform recoveries."
        }
      },
      {
        "@type": "Question",
        "name": "Which platforms do you support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support Facebook, Instagram, Gmail, TikTok, YouTube, Twitter/X, WhatsApp, Snapchat, LinkedIn, Telegram, Yahoo Mail, Outlook, and other social media and email platforms."
        }
      },
      {
        "@type": "Question",
        "name": "How much does account recovery cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Basic Recovery starts at KES 2,000 with email guidance and chat support. Premium Recovery costs KES 3,000 with done-for-you priority support and 12-hour response time."
        }
      },
      {
        "@type": "Question",
        "name": "Is payment secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all payments are processed securely through Flutterwave, a certified payment processor. We support M-PESA, cards, and bank transfers."
        }
      },
      {
        "@type": "Question",
        "name": "Can you help if my email was also hacked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We specialize in email recovery including Gmail, Yahoo, and Outlook. We can recover both your social media and email accounts."
        }
      }
    ]
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://vanillarecoveryhub.web.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Start Recovery",
        "item": "https://vanillarecoveryhub.web.app/recover"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Track Recovery",
        "item": "https://vanillarecoveryhub.web.app/track"
      }
    ]
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vanilla Recovery Hub",
    "url": "https://vanillarecoveryhub.web.app",
    "description": "Professional account recovery services for hacked social media and email accounts in Kenya. 95% success rate.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vanillarecoveryhub.web.app/track?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
