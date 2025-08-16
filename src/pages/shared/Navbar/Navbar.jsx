import React, { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { NavLink } from "react-router"; // 🛠️ Fixed import
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
        <li className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition duration-200"
            aria-label="Search"
          >
            Go
          </button>
        </li>
      )}

      <li className="flex items-center gap-4">
        <NavLink to="/">Home</NavLink>

        <button
          onClick={() => setShowNotification((prev) => !prev)}
          className="relative hidden md:inline-block"
          aria-label="Toggle Notifications"
        >
          {isAuthenticated && (
            <IoMdNotifications className="text-xl cursor-pointer" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pingOnce">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isAuthenticated && (
          <NavLink
            to="/membership"
            onClick={() => setOpen(false)}
            className="
    px-5 py-2
    bg-white
    border border-blue-600
    text-blue-600
    font-semibold
    rounded-md
    shadow-sm
    hover:bg-blue-50
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    transition
    duration-200
    ease-in-out
  "
          >
            Membership
          </NavLink>
        )}
      </li>

      {!isAuthenticated && (
        <li>
          <NavLink
            to="/login"
            className="
    px-5 py-2
    bg-gradient-to-r from-blue-600 to-blue-500
    text-white
    font-semibold
    rounded-full
    shadow-md
    hover:from-blue-700 hover:to-blue-600
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
    transition
    duration-300
    ease-in-out
  "
          >
            Join Us
          </NavLink>
        </li>
      )}
    </>
  );

  if (loading) return <Loader />;

  return (
    <nav className="bg-white border-b shadow-md px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="md:hidden">
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
          )}
          <NavLink to={"/"}>
            <div className="flex items-center gap-2">
              <img src={logo} alt="CodeCircle" className="h-10 w-auto" />
              <p className="text-xl font-bold">CodeCircle</p>
            </div>
          </NavLink>
        </div>

        {/* MIDDLE */}

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
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pingOnce">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
          )}

          {isAuthenticated && (
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center gap-3">
                  <button
                    onClick={() => setShowNotification((prev) => !prev)}
                    className="relative"
                    aria-label="Toggle Notifications"
                  >
                    <IoMdNotifications className="text-2xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pingOnce">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <img
                  src={photoToShow}
                  alt={user.displayName || "User Avatar"}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
                    @
                    {(user.displayName || user.email)
                      .toLowerCase()
                      .replace(/\s+/g, "_")}
                  </div>

                  <NavLink
                    to={isAdmin ? "/dashboard/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <BiSolidDashboard /> Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left"
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
        <ul
          className="
      md:hidden
      flex flex-col gap-3
      mt-3
      bg-white
      shadow
      rounded
      px-4 py-3
      font-medium
      fixed top-[calc(theme('spacing.14'))] left-0 right-0
      max-h-[calc(100vh - theme('spacing.14'))]
      overflow-auto
      z-50
      animate-slideDown
    "
        >
          {links}
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/membership" onClick={() => setOpen(false)}>
                  Membership
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left"
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
        <div className="absolute right-4 top-full mt-2 w-72 bg-white shadow-lg rounded-md p-4 z-50">
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
