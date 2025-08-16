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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl w-full max-w-md p-8 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-3xl before:pointer-events-none"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-sm -z-10"></div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 mt-2 ml-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400 mt-2 ml-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Login
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm text-gray-300 text-center pt-4"
        >
          Don&apos;t have an account?{' '}
          <Link to="/registration" className="text-purple-400 hover:text-purple-300 underline transition-colors">
            Register
          </Link>{' '}
          Now
        </motion.p>

        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative my-6 text-center"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-3 text-gray-300 text-sm">
            Or continue with
          </div>
        </motion.div>

        {/* Google Login */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300 text-white"
        >
          <FaGoogle className="text-lg text-red-400" />
          <span className="font-medium">Continue with Google</span>
        </motion.button>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-xs text-center mt-6 text-gray-400 space-y-2"
        >
          <p>
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-purple-400 underline hover:text-purple-300 transition-colors">
              Terms
            </Link>
            ,{' '}
            <Link to="/privacy" className="text-purple-400 underline hover:text-purple-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
          <p>
            Need help?{' '}
            <Link to="/contact" className="text-purple-400 underline hover:text-purple-300 transition-colors">
              Contact Us
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;