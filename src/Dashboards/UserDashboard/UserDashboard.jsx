import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { Link, Outlet, useNavigate } from 'react-router';
import { Menu } from 'lucide-react';
import { FaHome, FaUser, FaPlusCircle, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import Navbar from '../../pages/shared/Navbar/Navbar';
import Footer from '../../pages/shared/Footer/Footer';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {logOut } = UseAuthHook();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-20 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-gray-600/5 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10">
        <Navbar></Navbar>
      </header>
      
      <div className="relative min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 m-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl p-6 fixed md:relative z-50 md:z-auto transition-all duration-300 overflow-hidden`}
        >
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">User Dashboard</h2>
            <nav className="space-y-3">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <FaHome className="text-gray-400" /> Home
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="text-gray-400" /> My Profile
              </Link>
              <Link
                to="/dashboard/add-post"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <FaPlusCircle className="text-gray-400" /> Add Post
              </Link>
              <Link
                to="/dashboard/my-posts"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <FaFileAlt className="text-gray-400" /> My Posts
              </Link>
              <Link
                to="/dashboard/notifications-archive"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <FaFileAlt className="text-gray-400" /> Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium w-full transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-red-400/20"
              >
                <FaSignOutAlt className="text-red-400" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 min-h-screen flex flex-col relative">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden mb-4 text-gray-300 hover:text-white flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all duration-300"
          >
            <Menu className="w-6 h-6" />
            <span>Menu</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 flex-grow relative overflow-hidden"
          >
            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="relative z-10">
              <h1
                className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6"
                data-aos="fade-down"
              >
                Welcome to Your Dashboard
              </h1>

              {/* Nested routes will render here */}
              <div className="text-gray-300">
                <Outlet></Outlet>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <footer className="relative z-10">
        <Footer></Footer>
      </footer>
    </section>
  );
};

export default UserDashboard;