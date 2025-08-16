import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white px-4 flex flex-col justify-center items-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 group perspective-1000 transition-all duration-300 relative overflow-hidden"
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

        <h1 className="text-6xl font-bold text-red-400 mb-4 drop-shadow-lg relative z-10">
          404
        </h1>
        <p className="text-xl text-gray-200 mb-6 relative z-10">
          Oops! Page not found 😵
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 relative z-10"
        >
          🔙 Back to Home
        </button>
      </motion.div>

      <div className="text-center text-sm text-gray-300 mt-12 relative z-10">
        <p>
          📬{' '}
          <a href="mailto:support@codecircle.com" className="underline hover:text-indigo-200">
            support@codecircle.com
          </a>
        </p>
        <p className="mt-1">📍 Dhaka, Bangladesh</p>
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

export default ErrorPage;