import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaUsers, FaPenFancy, FaComments } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import UseAuthHook from '../../../hooks/contexthooks/UseAuthHook';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#4b5e8e', '#6b4b8e', '#4b8e7d'];

const AdminProfile = () => {
  const { user } = UseAuthHook();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);

  const myPostCount = posts?.filter(
    (post) => post?.authorEmail === user?.email
  ).length;

  const myCommentsCount = comments?.filter(
    (comment) => comment?.commenterEmail === user?.email
  ).length;

  useEffect(() => {
    AOS.init({ duration: 800 });

    axios.get('https://code-circle-server-three.vercel.app/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("❌ Failed to fetch posts:", err));

    axios.get('https://code-circle-server-three.vercel.app/comments')
      .then((res) => setComments(res.data))
      .catch((err) => console.error("❌ Failed to fetch comments:", err));

    axios.get('https://code-circle-server-three.vercel.app/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ Failed to fetch users:", err));
  }, [user?.email]);

  const chartData = [
    { name: 'Posts', value: posts.length },
    { name: 'Comments', value: comments.length },
    { name: 'Users', value: users.length },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-6 text-gray-200 font-sans">
      <div
        className="max-w-4xl mx-auto bg-[rgba(30,41,59,0.3)] backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-10 border border-[rgba(255,255,255,0.05)]"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
          👑 Admin Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[rgba(99,102,241,0.3)] shadow-lg">
            <img
              src={user?.photoURL || 'https://i.ibb.co/Yt3v5Q5/default-user.png'}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <p className="flex items-center gap-3 text-lg">
              <FaUser className="text-gray-400" /> {user?.displayName || 'N/A'}
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaEnvelope className="text-gray-400" /> {user?.email}
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaPenFancy className="text-gray-400" /> My Posts: <span>{myPostCount}</span>
              <button
                onClick={() => navigate('/admin-posts')}
                className="ml-4 px-3 py-1 bg-[rgba(99,102,241,0.5)] backdrop-blur-md hover:bg-[rgba(99,102,241,0.7)] transition text-sm rounded-lg text-gray-100 shadow-md border border-[rgba(255,255,255,0.1)]"
              >
                Show Posts
              </button>
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaComments className="text-gray-400" /> My Comments: {myCommentsCount}
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaUsers className="text-gray-400" /> Total Users: {users.length}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-100">
            📊 Site Overview
          </h3>
          <div className="max-w-sm mx-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  innerRadius={50}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }} />
                <Legend wrapperStyle={{ color: '#e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;