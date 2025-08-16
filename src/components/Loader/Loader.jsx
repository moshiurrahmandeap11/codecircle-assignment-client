import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-2 h-24">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="block w-4 h-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default Loader;
