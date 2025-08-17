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

  if (loading) return <p className="text-center text-gray-400 font-semibold mt-10">Loading reports...</p>;
  if (reports.length === 0)
    return <p className="text-center text-gray-400 italic mt-10">No reports found.</p>;

  return (
    <div className="min-h-screen  p-6 text-gray-200 font-sans">
      <div className="overflow-x-auto mt-8 px-2 md:px-8" data-aos="fade-up">
        <table className="min-w-full text-sm bg-[rgba(30,41,59,0.3)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.05)] shadow-2xl">
          <thead className="bg-[rgba(17,24,39,0.5)] backdrop-blur-md text-left text-xs uppercase tracking-wide select-none text-gray-100">
            <tr>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">#</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Comment</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Commenter</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Reported By</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Feedback</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Reported At</th>
              <th className="px-4 py-3 border border-[rgba(255,255,255,0.05)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((report, index) => (
              <tr
                key={report._id}
                className="text-center hover:bg-[rgba(45,55,72,0.4)] transition-all duration-200 border-b border-[rgba(255,255,255,0.05)]"
                data-aos="zoom-in-up"
              >
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] font-semibold text-gray-300">{startIndex + index + 1}</td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] max-w-xs break-words text-gray-100">{report.commentText}</td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] text-gray-200">{report.commenterEmail}</td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] text-gray-200">{report.reportedBy}</td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] italic text-gray-300">{report.feedback}</td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] text-xs text-gray-400">
                  {new Date(report.reportedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-[rgba(255,255,255,0.05)] space-y-2">
                  <button
                    onClick={() => giveWarning(report.commenterEmail)}
                    className="bg-[rgba(234,179,8,0.5)] backdrop-blur-md hover:bg-[rgba(234,179,8,0.7)] text-gray-100 text-xs px-3 py-1 rounded-lg w-full transition-colors border border-[rgba(255,255,255,0.1)]"
                  >
                    Give Warning
                  </button>
                  <button
                    onClick={() => snoozeAccount(report.reportedBy)}
                    className="bg-[rgba(249,115,22,0.5)] backdrop-blur-md hover:bg-[rgba(249,115,22,0.7)] text-gray-100 text-xs px-3 py-1 rounded-lg w-full transition-colors border border-[rgba(255,255,255,0.1)]"
                  >
                    Snooze Account
                  </button>
                  <button
                    onClick={() => deleteAccount(report.reportedBy)}
                    className="bg-[rgba(220,38,38,0.5)] backdrop-blur-md hover:bg-[rgba(220,38,38,0.7)] text-gray-100 text-xs px-3 py-1 rounded-lg w-full transition-colors border border-[rgba(255,255,255,0.1)]"
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
            className="px-3 py-1 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] text-gray-100 disabled:opacity-50 border border-[rgba(255,255,255,0.1)]"
          >
            ⬅ Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded-lg transition-all duration-200 border border-[rgba(255,255,255,0.1)] ${
                currentPage === idx + 1
                  ? "bg-[rgba(99,102,241,0.3)] backdrop-blur-md text-gray-50 font-semibold"
                  : "bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] text-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[rgba(30,41,59,0.5)] backdrop-blur-md hover:bg-[rgba(45,55,72,0.6)] text-gray-100 disabled:opacity-50 border border-[rgba(255,255,255,0.1)]"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;