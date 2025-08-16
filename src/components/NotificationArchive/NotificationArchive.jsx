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
    <div className="min-h-screen bg-gradient-to-b from-[#1f2937] to-[#111827] p-6 text-gray-300 font-sans">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-700 hover:bg-purple-600 transition-colors text-white font-medium shadow-md"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-300 drop-shadow-md">
        📦 Archived Notifications
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table data-aos="fade-up" className="min-w-full bg-[#2d3748] rounded-lg">
          <thead className="bg-[#4c51bf] text-left text-sm uppercase tracking-wide select-none">
            <tr>
              <th className="py-3 px-6 text-indigo-100">Type</th>
              <th className="py-3 px-6 text-indigo-100">Message</th>
              <th className="py-3 px-6 text-indigo-100">Date</th>
              <th className="py-3 px-6 text-indigo-100">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-indigo-400 italic">
                  No archived notifications found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="group border-b border-indigo-700 hover:bg-indigo-800 transition-colors cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 60}
                >
                  <td className="py-4 px-6 capitalize font-semibold text-indigo-200">{item.type}</td>
                  <td className="py-4 px-6 text-indigo-100">{item.message}</td>
                  <td className="py-4 px-6 text-indigo-300 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-opacity"
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
            pageClassName="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white"
            activeClassName="bg-indigo-400 text-gray-900 font-bold shadow-lg"
            previousClassName="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white"
            nextClassName="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationArchive;
