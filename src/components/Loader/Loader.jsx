import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-2 h-24 bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-lg shadow-lg">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="block w-4 h-4 bg-gradient-to-r from-cyan-400/60 to-blue-500/60 rounded-full animate-bounce border border-white/20"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default Loader;