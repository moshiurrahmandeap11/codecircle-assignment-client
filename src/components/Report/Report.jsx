import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const ITEMS_PER_PAGE = 10;

const Report = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchReportsAndUsers = async () => {
      try {
        const [reportsRes, usersRes] = await Promise.all([
          axios.get("https://code-circle-server-three.vercel.app/comment-reports"),
          axios.get("https://code-circle-server-three.vercel.app/users"),
        ]);
        const sorted = reportsRes.data.sort(
          (a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)
        );
        setReports(sorted);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch reports or users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsAndUsers();
  }, []);

  const findUserByEmail = (email) => users.find((u) => u.email === email);

  const giveWarning = async (userEmail) => {
    try {
      await axios.post("https://code-circle-server-three.vercel.app/notifications", {
        userEmail,
        type: "warning",
        message: "You received a warning due to inappropriate comment.",
      });
      alert(`⚠️ Warning notification sent to ${userEmail}`);
    } catch (err) {
      console.log(err);
      alert("Failed to send warning notification");
    }
  };

  const snoozeAccount = async (userEmail) => {
    try {
      await axios.patch(`https://code-circle-server-three.vercel.app/users/snooze`, {
        email: userEmail,
        snoozeUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      });
      alert(`⏳ Account for ${userEmail} snoozed for 10 days.`);
    } catch {
      alert("Failed to snooze account");
    }
  };

  const deleteAccount = async (userEmail) => {
    try {
      await axios.delete(`https://code-circle-server-three.vercel.app/users/delete`, { data: { email: userEmail } });
      alert(`🗑️ Account for ${userEmail} deleted and email sent.`);
      setReports((prev) => prev.filter((r) => r.reportedBy !== userEmail));
      setUsers((prev) => prev.filter((u) => u.email !== userEmail));
    } catch (error) {
      console.log(error);
      alert("Failed to delete account");
    }
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <p className="text-center text-indigo-500 font-semibold mt-10">Loading reports...</p>;
  if (reports.length === 0)
    return <p className="text-center text-gray-500 italic mt-10">No reports found.</p>;

  return (
    <div className="overflow-x-auto mt-8 px-2 md:px-8" data-aos="fade-up">
      <table className="min-w-full text-sm border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-400 to-violet-500 text-white uppercase text-xs">
          <tr>
            <th className="px-4 py-3 border">#</th>
            <th className="px-4 py-3 border">Comment</th>
            <th className="px-4 py-3 border">Commenter</th>
            <th className="px-4 py-3 border">Reported By</th>
            <th className="px-4 py-3 border">Feedback</th>
            <th className="px-4 py-3 border">Reported At</th>
            <th className="px-4 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReports.map((report, index) => (
            <tr
              key={report._id}
              className="text-center hover:bg-indigo-50 transition-all duration-200"
              data-aos="zoom-in-up"
            >
              <td className="px-4 py-2 border font-semibold text-gray-700">{startIndex + index + 1}</td>
              <td className="px-4 py-2 border max-w-xs break-words text-gray-800">{report.commentText}</td>
              <td className="px-4 py-2 border text-indigo-700">{report.commenterEmail}</td>
              <td className="px-4 py-2 border text-pink-600">{report.reportedBy}</td>
              <td className="px-4 py-2 border italic text-gray-600">{report.feedback}</td>
              <td className="px-4 py-2 border text-xs text-gray-500">
                {new Date(report.reportedAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 border space-y-1">
                <button
                  onClick={() => giveWarning(report.commenterEmail)}
                  className="bg-yellow-300 hover:bg-yellow-400 text-xs px-2 py-1 rounded text-black w-full"
                >
                   Give Warning
                </button>
                <button
                  onClick={() => snoozeAccount(report.reportedBy)}
                  className="bg-orange-400 hover:bg-orange-500 text-xs px-2 py-1 rounded text-white w-full"
                >
                   Snooze Account
                </button>
                <button
                  onClick={() => deleteAccount(report.reportedBy)}
                  className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1 rounded text-white w-full"
                >
                  Delete Account
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap" data-aos="fade-up">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded border transition-all duration-200 ${
              currentPage === idx + 1
                ? "bg-indigo-500 text-white font-semibold"
                : "bg-white hover:bg-indigo-100"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Report;
