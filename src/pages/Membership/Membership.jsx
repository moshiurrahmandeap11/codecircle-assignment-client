import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import {
  CheckCircle,
  Star,
  BadgeCheck,
  FileText,
  Users,
  Zap,
  Trophy,
} from "lucide-react";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";

const iconMap = {
  Users,
  FileText,
  Zap,
  BadgeCheck,
  CheckCircle,
  Star,
  Trophy,
};

const Membership = () => {
  const navigate = useNavigate();
  const { user } = UseAuthHook();
  const [plans, setPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800 });

    // Load membership plans
    const fetchPlans = async () => {
      try {
        const res = await axios.get("https://code-circle-server-three.vercel.app/membershipplans");
        setPlans(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch membership plans:", err);
      }
    };

    const fetchUserPayments = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/payments?email=${user.email}`);
        const planIds = res.data.map(payment => payment.planId); 
        setUserPlans(planIds);
      } catch (err) {
        console.error("❌ Failed to fetch user payment history:", err);
      }
    };

    fetchPlans();
    fetchUserPayments();
  }, [user?.email]);

  const handleFreePlan = () => {
    navigate("/");
  };

  const handlePay = (id) => {
    navigate(`/payment/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16  min-h-screen">
      {/* Header */}
      <div className="text-center mb-12" data-aos="fade-down">
        <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Membership Plans</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Join our community to unlock exclusive benefits, features, and direct
          access to premium resources that help you grow faster.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" data-aos="fade-up">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">💡 Learn Faster</h3>
          <p className="text-sm text-gray-300">Get access to curated tutorials, guides, and best practices.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">⚡ Priority Support</h3>
          <p className="text-sm text-gray-300">Get your queries answered faster with priority response.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">🏆 Recognition</h3>
          <p className="text-sm text-gray-300">Earn badges, get recognized as a contributor in the community.</p>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up">
        {plans.map((plan, index) => {
          const isUserPlan = userPlans.some(
            id => id === plan._id || id === plan._id?.toString()
          );

          return (
            <div
              key={index}
              className={`p-8 rounded-2xl shadow-2xl border border-white/20 bg-gradient-to-b from-white/10 to-black/20 backdrop-blur-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 relative overflow-hidden`}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <h4 className="text-xl font-semibold text-white mb-2 relative z-10">{plan.title}</h4>
              <p className="text-3xl font-bold text-indigo-300 mb-4 relative z-10">{plan.price}</p>
              <ul className="space-y-3 mb-6 relative z-10">
                {plan.features.map((feat, i) => {
                  const Icon = iconMap[feat.icon] || CheckCircle;
                  return (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                      <Icon size={18} className="text-indigo-400 shrink-0" />
                      <span>{feat.label}</span>
                    </li>
                  );
                })}
              </ul>
              {plan.title === "Free Plan" ? (
                <button
                  onClick={handleFreePlan}
                  className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 relative z-10"
                >
                  Continue with Free
                </button>
              ) : (
                <button
                  onClick={() => handlePay(plan._id)}
                  disabled={isUserPlan}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-300 relative z-10 ${
                    isUserPlan
                      ? "bg-gray-500/50 text-gray-300 cursor-not-allowed relative group backdrop-blur-sm"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  }`}
                >
                  {isUserPlan ? (
                    <span className="relative">
                      Already a Member
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max text-xs bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        You're already a member
                      </div>
                    </span>
                  ) : (
                    "Get Membership"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Membership;