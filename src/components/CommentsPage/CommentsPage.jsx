import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";
import toast from "react-hot-toast";

const FEEDBACK_OPTIONS = [
  "Offensive Language",
  "Spam or Promotion",
  "Irrelevant Comment",
];

const CommentPage = () => {
  const { user } = UseAuthHook();
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/comments/${postId}`);
        const withReportFlags = res.data.map((c) => ({
          ...c,
          selectedFeedback: "",
          reported: false,
        }));
        setComments(withReportFlags);
      } catch (err) {
        console.error("Error loading comments", err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleFeedbackChange = (index, value) => {
    setComments((prev) =>
      prev.map((comment, i) =>
        i === index ? { ...comment, selectedFeedback: value } : comment
      )
    );
  };

const handleReport = async (index) => {
  const comment = comments[index];
  if (!user?.email) {
    toast.error("You gotta be logged in to report comments!");
    return;
  }
  if (!comment.selectedFeedback) {
    toast.error("Please select feedback before reporting.");
    return;
  }

  
  const reportPayload = {
    postId,
    commentId: comment._id,
    commentText: comment.commentText,
    commenterEmail: comment.commenterEmail,
    reportedBy: user.email,
    feedback: comment.selectedFeedback,
    reportedAt: new Date().toISOString(),
  };
  
  console.log(reportPayload);


  try {
    await axios.post("https://code-circle-server-three.vercel.app/comment-reports", reportPayload);

    setComments((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, reported: true } : c
      )
    );

    toast.success("Comment reported successfully! Thanks for your feedback.");
  } catch (err) {
    console.error("Failed to report comment:", err);
    toast.error("Oops, failed to report the comment. Try again later.");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900/70 via-gray-900/60 to-black/80 border-2 border-transparent shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Comments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead className=" text-indigo-700 text-sm">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Comment</th>
              <th className="p-2">Feedback</th>
              <th className="p-2">Report</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, idx) => (
              <tr key={comment._id || idx} className="text-sm border-t">
                <td className="p-2">{comment.commenterEmail}</td>
                <td className="p-2">
                  {comment.commentText.length > 20
                    ? `${comment.commentText.slice(0, 20)}...`
                    : comment.commentText}
                </td>
                <td className="p-2">
<select
  value={comment.selectedFeedback}
  onChange={(e) => handleFeedbackChange(idx, e.target.value)}
  className="w-full px-3 py-2 rounded bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-black "
  disabled={comment.reported}
>
  <option value="" className="bg-black  ">Select feedback</option>
  {FEEDBACK_OPTIONS.map((option, i) => (
    <option key={i} value={option} className="bg-gray-900 text-white hover:text-black ">
      {option}
    </option>
  ))}
</select>

                </td>
                <td className="p-2 text-center">
                  <button
                    disabled={!comment.selectedFeedback || comment.reported}
                    onClick={() => handleReport(idx)}
                    className={`px-3 py-1 rounded text-white ${
                      comment.reported
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {comment.reported ? "Reported" : "Report"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentPage;
