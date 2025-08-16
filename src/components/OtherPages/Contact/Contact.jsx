import React from 'react';
import Typical from 'react-typical';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white px-4 py-12 md:px-8 lg:px-24 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div data-aos="fade-down" className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            <Typical
              steps={['Let’s Talk 👋', 1500, 'Send Us a Message 💬', 1500, 'We’d Love to Hear From You ❤️', 2000]}
              loop={Infinity}
              wrapper="span"
            />
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            Have a question, feedback, or just want to say hi? Fill out the form below and we’ll get back to you soon.
          </p>
        </div>

        <form
          data-aos="fade-up"
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 group perspective-1000 transition-all duration-300 relative overflow-hidden"
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

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-200">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-200">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-200">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-300 mt-10">
          <p>📬 support@codecircle.com</p>
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

export default Contact;