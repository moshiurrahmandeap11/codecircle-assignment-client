import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUsers, FaBullhorn, FaFlag } from "react-icons/fa";
import MakeAnnouncement from "./MakeAnnouncement/MakeAnnouncement";
import Report from "../../components/Report/Report";
import Footer from "../../pages/shared/Footer/Footer";
import Navbar from "../../pages/shared/Navbar/Navbar";
import AdminProfile from "./AdminProfile/AdminProfile";
import AddPost from "../../components/AddPost/AddPost";
import AddTags from "../../components/Tags/AddTags/AddTags";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";


const AdminDashboard = () => {
  const [view, setView] = useState("users");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchData = async () => {
      try {
        const [usersRes, paymentsRes] = await Promise.all([
          axios.get("https://code-circle-server-three.vercel.app/users"),
          axios.get("https://code-circle-server-three.vercel.app/payments"),
        ]);
        setUsers(usersRes.data);
        setPayments(paymentsRes.data);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserPlanTitle = (user) => {
    const userPayments = payments.filter((p) => p.userId === user.uid);
    const yearly = userPayments.find((p) =>
      p.planTitle.toLowerCase().includes("yearly")
    );
    const monthly = userPayments.find((p) =>
      p.planTitle.toLowerCase().includes("monthly")
    );
    return yearly?.planTitle || monthly?.planTitle || userPayments[0]?.planTitle || null;
  };

  const getMembershipStatus = (user) => {
    if (user.badge?.toLowerCase() === "bronze") {
      return <span className="text-red-400 font-semibold">Inactive</span>;
    }
    if (user.badge?.toLowerCase() === "gold") {
      const plan = getUserPlanTitle(user);
      return (
        <span className="text-green-400 font-semibold">
          Active {plan && `(${plan})`}
        </span>
      );
    }
    return <span className="text-gray-400">Unknown</span>;
  };

const handleMakeAdmin = async (userId, isAdmin) => {
  const newRole = isAdmin ? "user" : "admin";

  try {
    await axios.put(`https://code-circle-server-three.vercel.app/users/${userId}`, {
      role: newRole,
    });

    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, role: newRole } : u
      )
    );
    toast.success(`user is now ${newRole}`)
  } catch (err) {
    console.error("❌ Failed to update user role:", err);
  }
};


  if (loading) {
    return <Loader></Loader>
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-gray-600/5 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10">
        <Navbar></Navbar>
      </header>
      
      <div className="relative flex flex-col md:flex-row p-4 md:p-6 gap-6 min-h-screen">
        {/* Sidebar */}
        <aside className="md:w-72 w-full backdrop-blur-xl bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl space-y-4 sticky top-0 z-20 relative overflow-hidden">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">Admin Menu</h2>
            
            <button
              onClick={() => setView("admin-profile")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "admin-profile" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaUsers className="text-gray-300" /> Admin Profile
            </button>
            
            <button
              onClick={() => setView("users")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "users" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaUsers className="text-gray-300" /> Manage Users
            </button>
            
            <button
              onClick={() => setView("reports")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "reports" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaFlag className="text-gray-300" /> Reported Comments
            </button>
            
            <button
              onClick={() => setView("announcement")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "announcement" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaBullhorn className="text-gray-300" /> Make Announcement
            </button>
            
            <button
              onClick={() => setView("make-posts")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "make-posts" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaBullhorn className="text-gray-300" /> Add Posts
            </button>
            
            <button
              onClick={() => setView("tags")}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                view === "tags" ? "bg-white/15 border-white/20 text-white font-semibold" : "text-gray-300"
              }`}
            >
              <FaBullhorn className="text-gray-300" /> Add Tags
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-auto max-h-screen relative">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="relative z-10">
            {view === "users" && (
              <section>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                  data-aos="fade-down"
                >
                  Manage Users
                </h2>
                <div className="overflow-x-auto rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                  <table className="w-full text-sm md:text-base table-auto min-w-full">
                    <thead className="bg-white/10 backdrop-blur-sm border-b border-white/10">
                      <tr>
                        <th className="p-4 text-left text-gray-200 font-semibold">Name</th>
                        <th className="p-4 text-left text-gray-200 font-semibold">Email</th>
                        <th className="p-4 text-center text-gray-200 font-semibold">Admin</th>
                        <th className="p-4 text-center text-gray-200 font-semibold">Membership</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user,) => (
                        <tr
                          key={user._id}
                          className="border-b border-white/5 hover:bg-white/5 transition duration-300"
                        >
                          <td className="p-4 text-gray-300">{user.fullName || "N/A"}</td>
                          <td className="p-4 text-gray-300 break-words">{user.email}</td>
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={user.role === "admin"}
                              onChange={() =>
                                handleMakeAdmin(user._id, user.role === "admin")
                              }
                              className="w-5 h-5 cursor-pointer accent-white/20"
                            />
                          </td>
                          <td className="p-4 text-center">
                            {getMembershipStatus(user)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {view === "reports" && (
              <section>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent"
                  data-aos="fade-left"
                >
                  Reported Comments
                </h2>
                <Report />
              </section>
            )}

            {view === "announcement" && (
              <section>
                <MakeAnnouncement />
              </section>
            )}
            {view === "admin-profile" && (
              <section>
                <AdminProfile />
              </section>
            )}
            {view === "make-posts" && (
              <section>
                <AddPost />
              </section>
            )}
            {view === "tags" && (
              <section>
                <AddTags />
              </section>
            )}
          </div>
        </main>
      </div>
      
      <footer className="relative z-10">
        <Footer></Footer>
      </footer>
    </section>
  );
};

export default AdminDashboard;