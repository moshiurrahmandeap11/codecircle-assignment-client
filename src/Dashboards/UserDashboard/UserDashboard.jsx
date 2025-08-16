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
    <section>

    <header>
      <Navbar></Navbar>
    </header>
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-indigo-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 m-6 rounded-lg bg-white shadow-xl p-6 fixed md:relative z-50 md:z-auto transition-all duration-300`}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">User Dashboard</h2>
        <nav className="space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-2 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUser /> My Profile
          </Link>
          <Link
            to="/dashboard/add-post"
            className="flex items-center gap-3 px-4 py-2 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            <FaPlusCircle /> Add Post
          </Link>
          <Link
            to="/dashboard/my-posts"
            className="flex items-center gap-3 px-4 py-2 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            <FaFileAlt /> My Posts
          </Link>
          <Link
            to="/dashboard/notifications-archive"
            className="flex items-center gap-3 px-4 py-2 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium"
            onClick={() => setSidebarOpen(false)}
          >
            <FaFileAlt /> Notifications
          </Link>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg font-medium w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6  min-h-screen flex flex-col">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden mb-4 text-indigo-600 flex items-center gap-2"
          >
          <Menu className="w-6 h-6" />
          <span>Menu</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md p-6 flex-grow"
          >
          <h1
            className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6"
            data-aos="fade-down"
            >
            Welcome to Your Dashboard
          </h1>

          {/* Nested routes will render here */}
            <Outlet></Outlet>
        </motion.div>
      </div>
    </div>
    <footer>
      <Footer></Footer>
    </footer>
    </section>
  );
};

export default UserDashboard;
