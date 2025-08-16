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
      return <span className="text-red-600 font-semibold">Inactive</span>;
    }
    if (user.badge?.toLowerCase() === "gold") {
      const plan = getUserPlanTitle(user);
      return (
        <span className="text-green-600 font-semibold">
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
    <section>
        <header>
            <Navbar></Navbar>
        </header>
    <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6 min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-72 w-full bg-white backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg space-y-4 sticky top-0 z-20">
        <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4">Admin Menu</h2>
        <button
          onClick={() => setView("admin-profile")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "admin-profile" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaUsers /> Admin Profile
        </button>
        <button
          onClick={() => setView("users")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "users" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaUsers /> Manage Users
        </button>
        <button
          onClick={() => setView("reports")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "reports" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaFlag /> Reported Comments
        </button>
        <button
          onClick={() => setView("announcement")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "announcement" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaBullhorn /> Make Announcement
        </button>
        <button
          onClick={() => setView("make-posts")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "make-posts" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaBullhorn /> Add Posts
        </button>
        <button
          onClick={() => setView("tags")}
          className={`flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-indigo-100 transition ${
            view === "tags" ? "bg-indigo-300 font-semibold" : ""
          }`}
        >
          <FaBullhorn /> Add Tags
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-white backdrop-blur-sm rounded-2xl shadow-lg overflow-auto max-h-screen">
        {view === "users" && (
          <section>
            <h2
              className="text-2xl md:text-3xl font-bold mb-6 text-indigo-700"
              data-aos="fade-down"
            >
              Manage Users
            </h2>
            <div className="overflow-x-auto rounded">
              <table className="w-full border text-sm md:text-base table-auto min-w-full">
                <thead className="bg-indigo-100 text-left">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border text-center">Admin</th>
                    <th className="p-3 border text-center">Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50 transition duration-200"
                    >
                      <td className="p-3 border">{user.fullName || "N/A"}</td>
                      <td className="p-3 border break-words">{user.email}</td>
                      <td className="p-3 border text-center">
                        <input
                          type="checkbox"
                          checked={user.role === "admin"}
                          onChange={() =>
                            handleMakeAdmin(user._id, user.role === "admin")
                          }
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 border text-center">
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
              className="text-2xl md:text-3xl font-bold mb-6 text-red-600"
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
      </main>
    </div>
    <footer>
        <Footer></Footer>
    </footer>
    </section>
  );
};

export default AdminDashboard;
