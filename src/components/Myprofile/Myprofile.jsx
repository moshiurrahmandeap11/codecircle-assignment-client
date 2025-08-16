import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';  
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import Loader from '../Loader/Loader';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaMedal, FaEdit } from 'react-icons/fa';

const MyProfile = () => {
  const { user } = UseAuthHook();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', photoURL: '' });

  const navigate = useNavigate();  

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("https://code-circle-server-three.vercel.app/users");
        const matchedUser = res.data.find(u => u.email === user.email);
        setProfile(matchedUser);
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/posts?authorEmail=${user.email}`);
        setRecentPosts(res.data);
      } catch (err) {
        console.error("Recent posts fetch error:", err);
      }
    };

    fetchUser();
    fetchRecentPosts();
  }, [user?.email]);

  const handleEdit = () => {
    setEditData({
      fullName: profile.fullName || '',
      photoURL: profile.photoURL || '',
    });
    setShowModal(true);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`https://code-circle-server-three.vercel.app/users/${id}`, editData);
      console.log('Update response:', res.data);
      if (res.data.modifiedCount > 0) {
        setProfile({ ...profile, ...editData });
        setShowModal(false);
      } else {
        alert('No changes made or update failed');
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center text-red-400 text-lg">User profile not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-6 py-3 backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
        >
          ← Back
        </button>

        {/* Profile Card */}
        <div
          data-aos="zoom-in-up"
          className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent blur-sm -z-10"></div>
          
          {/* Background decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <button
            onClick={handleEdit}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <FaEdit className="w-5 h-5" />
          </button>

          <div className="flex justify-center" data-aos="fade-up">
            <div className="relative">
              <img
                src={profile.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
          </div>

          <div className="text-center mt-8 space-y-3" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-3xl font-bold text-white/90">
              {profile.fullName || profile.displayName}
            </h1>
            <p className="text-white/60">{profile.email}</p>

            <div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-medium shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <FaMedal className="text-lg" />
              <span>{profile.badge || 'Bronze'} Badge</span>
            </div>

            <p
              className="mt-4 text-white/50 text-sm"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Joined: <span className="font-medium text-white/70">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-16" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-white/90 mb-8">Your Recent Posts</h2>
          
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {recentPosts.map((post, index) => (
                <div 
                  key={index} 
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3 className="text-white/80 group-hover:text-white font-semibold text-lg mb-3 line-clamp-1 transition-colors">
                    {post.postTitle}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-3 mb-4">
                    {post.postDescription}
                  </p>
                  <div className="text-xs text-white/40">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-white/60">No posts yet. Start creating your first post!</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
              data-aos="zoom-in"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent blur-sm -z-10"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-white/90">Update Profile</h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-white/80">Full Name</label>
                  <input
                    type="text"
                    className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white/80">Photo URL</label>
                  <input
                    type="text"
                    className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                    value={editData.photoURL}
                    onChange={(e) => setEditData({ ...editData, photoURL: e.target.value })}
                    placeholder="Enter photo URL"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 backdrop-blur-sm bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/15 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(profile._id)}
                  className="px-6 py-3 backdrop-blur-sm bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/25 transition-all duration-300 hover:scale-105"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;