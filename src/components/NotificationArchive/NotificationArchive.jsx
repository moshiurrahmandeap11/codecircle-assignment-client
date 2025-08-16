import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactPaginate from "react-paginate";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";
import { useNavigate } from "react-router";

const NotificationArchive = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = UseAuthHook();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const fetchNotifications = () => {
    if (!user?.email) return;

    fetch(`https://code-circle-server-three.vercel.app/notifications/archive?userEmail=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setCurrentPage(0);
      })
      .catch((err) => console.error("Fetch failed:", err));
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.email]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      const res = await fetch(`https://code-circle-server-three.vercel.app/notifications/archive/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Failed to delete notification");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete notification");
    }
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = notifications.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(notifications.length / ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-6 text-gray-200 font-sans">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] transition-colors text-gray-100 font-medium shadow-lg border border-[rgba(255,255,255,0.1)]"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center text-gray-100 drop-shadow-md">
        📦 Archived Notifications
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-2xl">
        <table data-aos="fade-up" className="min-w-full bg-[rgba(30,41,59,0.3)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.05)]">
          <thead className="bg-[rgba(17,24,39,0.5)] backdrop-blur-md text-left text-sm uppercase tracking-wide select-none">
            <tr>
              <th className="py-4 px-6 text-gray-100">Type</th>
              <th className="py-4 px-6 text-gray-100">Message</th>
              <th className="py-4 px-6 text-gray-100">Date</th>
              <th className="py-4 px-6 text-gray-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400 italic">
                  No archived notifications found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="group border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(45,55,72,0.4)] transition-colors cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 60}
                >
                  <td className="py-4 px-6 capitalize font-semibold text-gray-200">{item.type}</td>
                  <td className="py-4 px-6 text-gray-100">{item.message}</td>
                  <td className="py-4 px-6 text-gray-300 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-[rgba(220,38,38,0.5)] backdrop-blur-md hover:bg-[rgba(220,38,38,0.7)] text-gray-100 px-3 py-1 rounded-lg transition-opacity border border-[rgba(255,255,255,0.1)]"
                      title="Delete notification"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {notifications.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
          <ReactPaginate
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex gap-3 text-sm select-none"}
            pageClassName="px-4 py-2 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] cursor-pointer text-gray-100 border border-[rgba(255,255,255,0.1)]"
            activeClassName="bg-[rgba(99,102,241,0.3)] text-gray-50 font-bold shadow-lg border-[rgba(255,255,255,0.2)]"
            previousClassName="px-4 py-2 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] cursor-pointer text-gray-100 border border-[rgba(255,255,255,0.1)]"
            nextClassName="px-4 py-2 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] cursor-pointer text-gray-100 border border-[rgba(255,255,255,0.1)]"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationArchive;