
import React from 'react';
import { useNavigate } from 'react-router';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! Page not found 😵</p>
      <button
        onClick={() => navigate("/")}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
      >
        🔙 Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
