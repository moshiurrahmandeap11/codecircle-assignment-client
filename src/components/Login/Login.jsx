import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';
import axios from 'axios'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { googleUser, loginUser, loading } = UseAuthHook();
  const togglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
    const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async ({ email, password }) => {
  try {
    const res = await loginUser(email, password);

    await axios.post(
      'https://code-circle-server-three.vercel.app/jwt',
      { email: res.user.email },
      { withCredentials: true } 
    );
    toast.success('Login successful!');
    navigate(from, { replace: true });
  } catch (err) {
    toast.error(err.message);
    console.error('❌ Login error:', err);
  }
};


const handleGoogleLogin = async () => {
  try {
    const res = await googleUser();
    const user = res.user;

    try {
      await axios.post(
        'https://code-circle-server-three.vercel.app/users',
        {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '',
          badge: 'Bronze',
        },
        { withCredentials: true }
      );
    } catch (backendErr) {
      console.warn(' Backend user POST failed:', backendErr);
    }


    await axios.post(
      'https://code-circle-server-three.vercel.app/jwt',
      { email: user.email },
      { withCredentials: true }
    );

    toast.success('Logged in with Google!');
    navigate(from, { replace: true });
  } catch (err) {
    toast.error('Google login failed');
    console.error(' Google Login Error:', err);
  }
};



  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Welcome Back | Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <span
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-700 text-center pt-2">
          Don&apos;t have an account?{' '}
          <Link to="/registration" className="text-indigo-600 underline">Register</Link> Now
        </p>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative bg-white px-3 text-gray-500 text-sm">
            Or continue with
          </div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <FaGoogle className="text-lg text-red-500" />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Footer */}
        <div className="text-xs text-center mt-6 text-gray-500 space-y-1">
          <p>
            By continuing, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-indigo-700">Terms</Link>,{' '}
            <Link to="/privacy" className="underline hover:text-indigo-700">Privacy Policy</Link>
          </p>
          <p>
            Need help?{' '}
            <Link to="/contact" className="underline hover:text-indigo-700">Contact Us</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
