import React from 'react';

const PrivacyPolicy = () => {
  const policies = [
    {
      title: "1. Information We Collect",
      content: `When you register or use CodeCircle, we may collect information such as your name, email address, profile picture, and usage data. We also gather technical details like device type, browser, and IP address...`,
    },
    {
      title: "2. How We Use Your Information",
      content: `Your data is used strictly to provide and improve our services. We may use your email to send updates, respond to support requests...`,
    },
    {
      title: "3. Data Sharing & Third Parties",
      content: `We do not sell, lease, or disclose your personal data to third parties without your permission, unless legally required...`,
    },
    {
      title: "4. Your Data Control & Rights",
      content: `You have full control over your data. You may access, update, or delete your account at any time...`,
    },
    {
      title: "5. Data Security & Retention",
      content: `Security is a top priority at CodeCircle. We use encrypted connections (SSL), secure storage practices, and regular audits to protect your information...`,
    },
    {
      title: "6. Policy Updates",
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations...`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-20 md:px-8 lg:px-20">
      <div data-aos="fade-down" className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          We value your privacy. Here’s how we collect, use, and protect your data while you're on CodeCircle.
        </p>
      </div>

      <div className="space-y-10 max-w-5xl mx-auto">
        {policies.map((item, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
