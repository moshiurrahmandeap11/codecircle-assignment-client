import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import axios from "axios";

const Registration = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createUser, googleUser, loading } = UseAuthHook();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    const { email, password, fullName, photoURL } = data;

    createUser(email, password)
      .then((res) => {
        const currentUser = res.user;

        updateProfile(currentUser, {
          displayName: fullName,
          photoURL,
        })
          .then(async () => {
            try {
              // Send user data to backend API instead of Firestore
              await axios.post("https://code-circle-server-three.vercel.app/users", {
                uid: currentUser.uid,
                email,
                fullName,
                photoURL,
                badge: "Bronze",
              });

              toast.success("Account created successfully!");
              navigate(from, { replace: true });
            } catch (err) {
              toast.error("Failed to save user in database");
              console.error("❌ Backend user save error:", err);
            }
          })
          .catch((err) => {
            toast.error("Profile update failed");
            console.error("🔥 Profile update error:", err);
          });
      })
      .catch((err) => {
        toast.error(err.message);
        console.error("❌ Registration Error:", err);
      });
  };

  const handleGoogleSignup = () => {
    googleUser()
      .then(async (res) => {
        const user = res.user;
        try {
          await axios.post("https://code-circle-server-three.vercel.app/users", {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || "Anonymous",
            photoURL: user.photoURL || "",
            badge: "Bronze",
          });
          toast.success("Google Sign Up Successful!");
          navigate(from, { replace: true });
        } catch (err) {
          toast.error("Failed to save user in database");
          console.error("❌ Backend user save error:", err);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error("Google Sign-In Error:", err);
      });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-lg p-8 border border-white/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 relative overflow-hidden"
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg relative z-10">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <input
              type="url"
              placeholder="Photo URL"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              {...register("photoURL", {
                required: "Photo URL is required",
                pattern: {
                  value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i,
                  message: "Enter a valid image URL",
                },
              })}
            />
            {errors.photoURL && (
              <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("terms", { required: "You must accept the terms" })}
              className="mt-1 w-4 h-4 accent-indigo-400"
            />
            <label className="text-sm text-gray-300">
              I agree to the{" "}
              <Link
                to="/terms"
                className="underline text-indigo-300 hover:text-indigo-200"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="underline text-indigo-300 hover:text-indigo-200"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative bg-transparent px-3 text-gray-300 text-sm">
            Or continue with
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-3 w-full py-2 bg-white/5 border border-white/20 rounded-md hover:bg-white/10 transition-all duration-300 text-white"
        >
          <FaGoogle className="text-lg text-red-400" />
          <span className="font-medium">Continue with Google</span>
        </button>

        <p className="text-sm text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-300 underline hover:text-indigo-200"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Registration;