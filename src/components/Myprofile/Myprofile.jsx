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

  if (loading) return <Loader />;
  if (!profile) return <div className="text-center text-red-500 mt-8">User profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <button
        onClick={() => navigate(-1)}  
        className="mb-6 px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
      >
        Back
      </button>

      <div
        data-aos="zoom-in-up"
        className="bg-white shadow-2xl rounded-3xl border border-indigo-200 p-8 relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-300 opacity-30 rounded-full blur-2xl"></div>

        <button
          onClick={handleEdit}
          className="absolute top-4 right-4 text-indigo-500 hover:text-indigo-700"
        >
          <FaEdit className="w-5 h-5" />
        </button>

        <div className="flex justify-center" data-aos="fade-up">
          <img
            src={profile.photoURL || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400 shadow-md"
          />
        </div>

        <div className="text-center mt-6 space-y-2" data-aos="fade-up" data-aos-delay="100">
          <h1 className="text-2xl font-bold text-indigo-700">
            {profile.fullName || profile.displayName}
          </h1>
          <p className="text-sm text-gray-600">{profile.email}</p>

          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm shadow"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaMedal className="text-lg" />
            <span>{profile.badge || 'Bronze'} Badge</span>
          </div>

          <p
            className="mt-2 text-gray-500 text-sm"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Joined: <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/*  Recent Posts */}
      <div className="mt-12" data-aos="fade-up">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Your Recent Posts</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {recentPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-indigo-600 font-semibold text-lg mb-2 line-clamp-1">{post.postTitle}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{post.postDescription}</p>
              <div className="mt-3 text-xs text-gray-400">Posted on: {new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-2xl bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Update Profile</h2>

            <label className="block mb-2 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-indigo-500"
              value={editData.fullName}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
            />

            <label className="block mb-2 font-medium text-gray-700">Photo URL</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-indigo-500"
              value={editData.photoURL}
              onChange={(e) => setEditData({ ...editData, photoURL: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(profile._id)}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;