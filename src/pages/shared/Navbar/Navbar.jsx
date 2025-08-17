import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { NavLink } from "react-router";
import { IoMdNotifications } from "react-icons/io";
import { Sling as Hamburger } from "hamburger-react";
import { BiSolidDashboard } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { FaHome, FaUsers, FaInfo, FaCode, FaBlog } from "react-icons/fa";
import UseAuthHook from "../../../hooks/contexthooks/UseAuthHook";
import Loader from "../../../components/Loader/Loader";
import toast from "react-hot-toast";
import axios from "axios";
import Notification from "../../../components/Notification/Notification";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [mongoUser, setMongoUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { user, loading, logOut } = UseAuthHook();
  const isAuthenticated = !!user;

  const currentMongoUser = mongoUser?.find((u) => u.email === user?.email);
  console.log(currentMongoUser);
  const isAdmin = currentMongoUser?.role === "admin";

  // Sticky Search Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const bannerSearch = document.getElementById("banner-search");
      if (!bannerSearch) return;

      const rect = bannerSearch.getBoundingClientRect();
      const isPassed = rect.bottom <= 0;
      setShowStickySearch(isPassed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Mongo User
  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://code-circle-server-three.vercel.app/users?email=${user.email}`
        )
        .then((res) => res.data && setMongoUser(res.data))
        .catch((err) => console.error("❌ Mongo user fetch error:", err));
    } else {
      setMongoUser(null);
    }
  }, [user?.email]);

  // Check Unread Notifications
  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://code-circle-server-three.vercel.app/notifications?userEmail=${user.email}`
        )
        .then((res) => {
          const unread = res.data.filter((n) => !n.isRead);
          setUnreadCount(unread.length);
        })
        .catch((err) => console.error("❌ Failed to check notifications", err));
    }
  }, [user?.email]);

  const handleNotificationsRead = async () => {
    if (!user?.email) return;

    try {
      await axios.patch(
        `https://code-circle-server-three.vercel.app/notifications/mark-read`,
        {
          userEmail: user.email,
        }
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged Out");
        setMongoUser(null);
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const photoToShow = mongoUser?.photoURL || user?.photoURL;

  // Logged Out User Links (3 routes)
  const loggedOutLinks = (
    <>
      {showStickySearch && (
        <li className="flex items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-white/20">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 text-sm bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
          <button
            className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white px-4 py-2 text-sm font-medium transition duration-300"
            aria-label="Search"
          >
            Go
          </button>
        </li>
      )}

      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaHome className="text-sm" /> Home
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/about" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaInfo className="text-sm" /> About
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaUsers className="text-sm" /> Contact
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/login"
          className="px-6 py-2 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl shadow-lg hover:from-white/30 hover:to-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-300 ease-in-out"
          onClick={() => setOpen(false)}
        >
          Join Us
        </NavLink>
      </li>
    </>
  );

  // Logged In User Links (5 routes)
  const loggedInLinks = (
    <>
      {showStickySearch && (
        <li className="flex items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-white/20">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 text-sm bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
          <button
            className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white px-4 py-2 text-sm font-medium transition duration-300"
            aria-label="Search"
          >
            Go
          </button>
        </li>
      )}

      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaHome className="text-sm" /> Home
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/posts" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaBlog className="text-sm" /> Posts
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/community" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaUsers className="text-sm" /> Community
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/code-editor" 
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FaCode className="text-sm" /> Code Editor
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/membership"
          onClick={() => setOpen(false)}
          className={({ isActive }) => 
            `flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-xl font-medium transition-all duration-300 ${
              isActive 
                ? 'text-white bg-white/15 border-white/30' 
                : 'text-gray-300 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`
          }
        >
          <FaUsers className="text-sm" /> Membership
        </NavLink>
      </li>

      <li className="flex items-center">
        <button
          onClick={() => setShowNotification((prev) => !prev)}
          className="relative group p-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          aria-label="Toggle Notifications"
        >
          <IoMdNotifications className="text-xl text-gray-300 group-hover:text-white transition-colors duration-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </li>
    </>
  );

  if (loading) return <Loader />;

  return (
    <nav className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl px-4 py-3 relative z-50 sticky top-0">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="md:hidden">
              <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
            </div>
          )}
          <NavLink to={"/"}>
            <div className="flex items-center gap-2">
              <img src={logo} alt="CodeCircle" className="h-10 w-auto drop-shadow-lg" />
              <p className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                CodeCircle
              </p>
            </div>
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ul className="hidden md:flex items-center gap-3 font-medium">
            {isAuthenticated ? loggedInLinks : loggedOutLinks}
          </ul>
          
          {!isAuthenticated && (
            <div className="md:hidden flex items-center gap-3">
              <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
            </div>
          )}

          {isAuthenticated && (
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="md:hidden flex items-center gap-3">
                  <button
                    onClick={() => setShowNotification((prev) => !prev)}
                    className="relative group p-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    aria-label="Toggle Notifications"
                  >
                    <IoMdNotifications className="text-xl text-gray-300 group-hover:text-white transition-colors duration-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <img
                  src={photoToShow}
                  alt={user.displayName || "User Avatar"}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-gray-900/90 border border-white/10 shadow-2xl rounded-2xl py-2 z-50 overflow-hidden">
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="px-4 py-2 text-sm text-gray-300 font-medium border-b border-white/10">
                      @{(user.displayName || user.email).toLowerCase().replace(/\s+/g, "_")}
                    </div>

                    <NavLink
                      to={isAdmin ? "/dashboard/admin" : "/dashboard"}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      <BiSolidDashboard /> Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 w-full text-gray-300 hover:bg-white/10 hover:text-white text-left transition-all duration-200"
                    >
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-2 mt-3 backdrop-blur-xl bg-gray-900/90 border border-white/10 shadow-2xl rounded-2xl px-4 py-3 font-medium fixed top-[calc(theme('spacing.16'))] left-4 right-4 max-h-[calc(100vh - theme('spacing.16'))] overflow-auto z-50 animate-slideDown">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            {isAuthenticated ? loggedInLinks : loggedOutLinks}
            {isAuthenticated && (
              <li className="pt-2 border-t border-white/10 mt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                >
                  <FiLogOut className="text-sm" /> Log Out
                </button>
              </li>
            )}
          </div>
        </ul>
      )}

      {/* Notification Panel */}
      {showNotification && (
        <div className="absolute right-4 top-full mt-2 w-72 backdrop-blur-xl bg-gray-900/90 border border-white/10 shadow-2xl rounded-2xl p-4 z-50 overflow-hidden">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <Notification
              userEmail={user?.email}
              onRead={handleNotificationsRead}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;