import React, { useState, useEffect } from "react";

import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import UseAuthHook from "../../../hooks/contexthooks/UseAuthHook";
import { useNavigate } from "react-router";

const MakeAnnouncement = () => {
  const { user } = UseAuthHook();
  const [form, setForm] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return toast.error("Title and description are required");
    }

    try {
      const announcement = {
        authorName: user?.displayName || user?.fullName || "Anonymous",
        authorImage: user?.photoURL || "/default-avatar.png",
        title: form.title,
        description: form.description,
        createdAt: new Date(),
      };

      await axios.post("https://code-circle-server-three.vercel.app/announcements", announcement);
      toast.success("📢 Announcement posted!");
      navigate("/");
      setForm({ title: "", description: "" });
    } catch (err) {
      console.error("Failed to post announcement:", err);
      toast.error("Failed to submit announcement");
    }
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12">
        <h2
          className="text-4xl font-bold text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-12"
          data-aos="fade-down"
        >
          📢 Make a New Announcement
        </h2>

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden"
          data-aos="fade-up"
        >
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10">
            {/* Author Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="relative">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="Author"
                  className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              <div>
                <p className="text-white font-semibold">
                  {user?.displayName || user?.fullName}
                </p>
                <p className="text-sm text-gray-300 opacity-80">{user?.email}</p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium text-gray-200 mb-1">Title</label>
              <input
                type="text"
                placeholder="Enter announcement title"
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-gray-400 transition-all duration-300"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-200 mb-1">
                Description
              </label>
              <textarea
                rows="5"
                placeholder="Enter detailed announcement..."
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 text-white placeholder-gray-400 transition-all duration-300"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="group relative px-6 py-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">Submit</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;