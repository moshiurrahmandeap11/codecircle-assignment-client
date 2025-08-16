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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2
        className="text-3xl font-bold text-center text-indigo-700 mb-8"
        data-aos="fade-down"
      >
        📢 Make a New Announcement
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl border space-y-6"
        data-aos="fade-up"
      >
        {/* Author Info */}
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="Author"
            className="w-14 h-14 rounded-full border shadow"
          />
          <div>
            <p className="text-gray-700 font-semibold">
              {user?.displayName || user?.fullName}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter announcement title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="5"
            placeholder="Enter detailed announcement..."
            className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
