import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Cookies = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const cookiePolicies = [
    {
      title: "1. What Are Cookies?",
      content: `Cookies are small text files placed on your device when you visit CodeCircle. They help us enhance your experience by remembering preferences, analyzing site usage, and enabling features like personalized content. Cookies may be session-based (temporary) or persistent (stored for a set period) depending on their purpose.`,
    },
    {
      title: "2. Types of Cookies We Use",
      content: `We use the following cookies: 
      - **Essential Cookies**: Necessary for core functionality, such as user authentication and site navigation.
      - **Performance Cookies**: Collect anonymized data to improve site performance and user experience.
      - **Functional Cookies**: Enable personalized features, like remembering your theme preferences.
      - **Analytics Cookies**: Help us understand how users interact with CodeCircle, such as tracking page visits and click patterns.
      We do not use advertising cookies or share cookie data with third parties for marketing purposes.`,
    },
    {
      title: "3. How We Use Cookies",
      content: `Cookies are used to provide a seamless and tailored experience on CodeCircle. They help us maintain your session, improve site speed, and analyze usage trends to enhance our services. For example, cookies may store your login status or display content based on your previous interactions. All data collected is processed securely and in accordance with our Privacy Policy.`,
    },
    {
      title: "4. Managing Your Cookie Preferences",
      content: `You can control cookies through your browser settings, such as disabling or deleting them. Note that disabling essential cookies may affect core functionality, like logging in or accessing certain features. CodeCircle provides a cookie consent popup on your first visit, allowing you to accept or customize cookie preferences. You can update these settings anytime via your account or browser.`,
    },
    {
      title: "5. Third-Party Cookies",
      content: `Some third-party services integrated with CodeCircle, such as analytics tools or payment processors, may set their own cookies. These are governed by the respective third-party privacy policies, and we ensure they meet our data protection standards. We do not allow third-party advertising cookies on our platform.`,
    },
    {
      title: "6. Updates to This Cookie Policy",
      content: `We may update this Cookie Policy to reflect changes in our practices or legal requirements. Updates will be posted here, and significant changes will be communicated via email or platform notifications. We encourage you to review this policy periodically to stay informed about how we use cookies.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white px-4 py-20 md:px-8 lg:px-20 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          data-aos="fade-down"
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Cookie Policy
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            We use cookies to enhance your experience on CodeCircle. Learn how we collect, use, and manage cookies below.
          </p>
        </motion.div>

        <div className="space-y-10">
          {cookiePolicies.map((policy, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20 group perspective-1000 transition-all duration-300 relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateZ(20px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateX(0) rotateY(0) scale(1) translateZ(0)';
              }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <h2 className="text-xl font-semibold text-indigo-300 mb-2 relative z-10">
                {policy.title}
              </h2>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base relative z-10">
                {policy.content}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-300 mt-12">
          <p>
            📬{' '}
            <a href="mailto:support@codecircle.com" className="underline hover:text-indigo-200">
              support@codecircle.com
            </a>
          </p>
          <p className="mt-1">📍 Dhaka, Bangladesh</p>
        </div>
      </div>

      {/* Inline CSS for perspective effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Cookies;