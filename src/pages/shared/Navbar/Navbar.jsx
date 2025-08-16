import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { NavLink } from "react-router";
import { IoMdNotifications } from "react-icons/io";
import { Sling as Hamburger } from "hamburger-react";
import { BiSolidDashboard } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
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

  const links = (
    <>
      {showStickySearch && (
        <li className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-purple-400/50">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 text-sm bg-transparent text-white placeholder-white/60 focus:outline-none"
          />
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 text-sm font-semibold transition duration-300"
            aria-label="Search"
          >
            Go
          </button>
        </li>
      )}

      <li className="flex items-center gap-4">
        <NavLink 
          to="/" 
          className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
        >
          Home
        </NavLink>

        <button
          onClick={() => setShowNotification((prev) => !prev)}
          className="relative hidden md:inline-block group"
          aria-label="Toggle Notifications"
        >
          {isAuthenticated && (
            <IoMdNotifications className="text-xl cursor-pointer text-white/80 group-hover:text-white transition-colors duration-300" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isAuthenticated && (
          <NavLink
            to="/membership"
            onClick={() => setOpen(false)}
            className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl shadow-lg hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition duration-300 ease-in-out"
          >
            Membership
          </NavLink>
        )}
      </li>

      {!isAuthenticated && (
        <li>
          <NavLink
            to="/login"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Join Us
          </NavLink>
        </li>
      )}
    </>
  );

  if (loading) return <Loader />;

  return (
    <nav className="bg-gradient-to-r from-slate-900/80 via-gray-900/80 to-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-2xl px-4 py-3 relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
              <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CodeCircle
              </p>
            </div>
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ul className="hidden md:flex items-center gap-6 font-medium">
            {links}
          </ul>
          {!isAuthenticated && (
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setShowNotification((prev) => !prev)}
                className="relative"
              >
                <IoMdNotifications className="text-2xl text-white/80" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
            </div>
          )}

          {isAuthenticated && (
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center gap-3">
                  <button
                    onClick={() => setShowNotification((prev) => !prev)}
                    className="relative group"
                    aria-label="Toggle Notifications"
                  >
                    <IoMdNotifications className="text-2xl text-white/80 group-hover:text-white transition-colors duration-300" />
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
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-xl py-2 z-50 border border-white/10">
                  <div className="px-4 py-2 text-sm text-white/80 font-semibold border-b border-white/10">
                    @
                    {(user.displayName || user.email)
                      .toLowerCase()
                      .replace(/\s+/g, "_")}
                  </div>

                  <NavLink
                    to={isAdmin ? "/dashboard/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    <BiSolidDashboard /> Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full text-white/80 hover:bg-white/10 hover:text-white text-left transition-all duration-200"
                  >
                    <FiLogOut /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-3 mt-3 bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-xl px-4 py-3 font-medium fixed top-[calc(theme('spacing.16'))] left-4 right-4 max-h-[calc(100vh - theme('spacing.16'))] overflow-auto z-50 animate-slideDown border border-white/10">
          {links}
          {isAuthenticated && (
            <>
              <li>
                <NavLink 
                  to="/membership" 
                  onClick={() => setOpen(false)}
                  className="text-white/90 hover:text-white transition-colors duration-300"
                >
                  Membership
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left text-white/90 hover:text-white transition-colors duration-300"
                >
                  Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      )}

      {/* Notification Panel */}
      {showNotification && (
        <div className="absolute right-4 top-full mt-2 w-72 bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-xl p-4 z-50 border border-white/10">
          <Notification
            userEmail={user?.email}
            onRead={handleNotificationsRead}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;