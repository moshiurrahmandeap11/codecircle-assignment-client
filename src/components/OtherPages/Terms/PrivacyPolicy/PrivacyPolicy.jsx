import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const policies = [
    {
      title: "1. Information We Collect",
      content: `When you register or use CodeCircle, we may collect information such as your name, email address, profile picture, and usage data. We also gather technical details like device type, browser, and IP address to enhance your experience and ensure platform security.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `Your data is used strictly to provide and improve our services. We may use your email to send updates, respond to support requests, or notify you about account activities. Usage data helps us analyze trends and optimize CodeCircle's functionality.`,
    },
    {
      title: "3. Data Sharing & Third Parties",
      content: `We do not sell, lease, or disclose your personal data to third parties without your permission, unless legally required by authorities or necessary for service provision (e.g., payment processors). We ensure third-party partners adhere to strict privacy standards.`,
    },
    {
      title: "4. Your Data Control & Rights",
      content: `You have full control over your data. You may access, update, or delete your account at any time through your profile settings. You can also request data exports or opt out of communications by contacting us at support@codecircle.com.`,
    },
    {
      title: "5. Data Security & Retention",
      content: `Security is a top priority at CodeCircle. We use encrypted connections (SSL), secure storage practices, and regular audits to protect your information. Data is retained only as long as necessary to fulfill our services or as required by law.`,
    },
    {
      title: "6. Policy Updates",
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. Updates will be posted on this page, and significant changes will be communicated via email or platform notifications.`,
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
            Privacy Policy
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            We value your privacy. Here’s how we collect, use, and protect your data while you're on CodeCircle.
          </p>
        </motion.div>

        <div className="space-y-10">
          {policies.map((item, index) => (
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
                {item.title}
              </h2>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base relative z-10">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-300 mt-12">
          <p>📬 <a href="mailto:support@codecircle.com" className="underline hover:text-indigo-200">support@codecircle.com</a></p>
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

export default PrivacyPolicy;