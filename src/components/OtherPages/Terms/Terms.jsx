import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Terms = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using CodeCircle, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of the terms, you must refrain from using the service. We reserve the right to update or modify these terms at any time without prior notice. Continued use of the platform signifies your acceptance of any changes. It is your responsibility to regularly check the Terms for any updates or changes that might affect your rights or obligations. These Terms constitute a legal agreement between you and CodeCircle, and govern your use of our services, including content submission, user interactions, and data handling.`
    },
    {
      title: "2. User Responsibilities",
      content: `You are responsible for maintaining the confidentiality of your login credentials and all activities that occur under your account. You agree not to use CodeCircle for any illegal or unauthorized purpose, including but not limited to harassment, spamming, or uploading harmful content. Users must respect the rights and dignity of other members, including intellectual property and privacy. We reserve the right to suspend or terminate your account if any suspicious, harmful, or abusive behavior is detected. Always double-check your interactions and be respectful to the CodeCircle community.`
    },
    {
      title: "3. Content Ownership",
      content: `All content you create and share on CodeCircle remains your intellectual property. However, by posting on the platform, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content within the platform and for promotional purposes. You are responsible for ensuring that the content you share does not violate any copyright, trademark, or other intellectual property rights. Any misuse of third-party content may result in content removal or account suspension. We value creativity and want our users to feel safe sharing their work.`
    },
    {
      title: "4. Privacy & Data Usage",
      content: `CodeCircle takes your privacy seriously. We collect minimal personal information and use it solely for providing and improving our services. Your data is stored securely and is never sold to third parties. We may use cookies and similar technologies for analytics and performance optimization. Users can manage cookie preferences through their browser settings. By using the platform, you consent to our Privacy Policy. If you have any concerns about your data or wish to request deletion, please contact our support team. Transparency is key, and your trust matters to us.`
    },
    {
      title: "5. Termination & Suspension",
      content: `We reserve the right to suspend or terminate your access to CodeCircle at any time for any reason, including but not limited to violations of our Terms, inappropriate behavior, or legal compliance. In most cases, users will be notified and given a chance to appeal or correct the issue before action is taken. In severe or repeat violations, termination may be immediate and without prior notice. Terminated users may lose access to all data and content associated with their account. We aim to maintain a safe, positive space for all creators, so rules are enforced consistently.`
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-8 lg:px-20">
      <div data-aos="fade-down" className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Please read these terms carefully before using CodeCircle. By using our platform, you agree to the following terms.
        </p>
      </div>

      <div className="space-y-10 max-w-5xl mx-auto">
        {terms.map((term, index) => (
          <div key={index} data-aos="fade-up" className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{term.title}</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">{term.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
