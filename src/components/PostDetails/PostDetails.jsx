import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";
import { motion } from "framer-motion";
import Modal from "react-modal";
import { Helmet } from "react-helmet";

Modal.setAppElement("#root");

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UseAuthHook();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComment, setModalComment] = useState("");

  const shareUrl = `${window.location.origin}/post/${id}`;
  const fallbackThumbnail = "/default-og-image.jpg";

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postRes = await axios.get(`https://code-circle-server-three.vercel.app/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await axios.get(`https://code-circle-server-three.vercel.app/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Failed to load post or comments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!user) return alert("You must be logged in to comment");
    if (!commentText.trim()) return alert("Comment cannot be empty");

    try {
      await axios.post("https://code-circle-server-three.vercel.app/comments", {
        postId: id,
        commentText,
        commenterEmail: user.email,
      });

      setComments((prev) => [
        ...prev,
        { commentText, commenterEmail: user.email, createdAt: new Date() },
      ]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment");
    }
  };

  const handleVote = async (type) => {
    if (!user) return alert("Login to vote");

    setVoteLoading(true);
    try {
      await axios.put(`https://code-circle-server-three.vercel.app/posts/vote/${id}`, {
        voteType: type,
        userEmail: user.email,
      });

      const postRes = await axios.get(`https://code-circle-server-three.vercel.app/posts/${id}`);
      setPost(postRes.data);
    } catch (err) {
      console.error("Vote failed", err);
      alert("Failed to submit vote");
    } finally {
      setVoteLoading(false);
    }
  };

  const openModal = (text) => {
    setModalComment(text);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalComment("");
  };

  if (loading)
    return (
      <div className="text-center py-20 text-indigo-500 animate-pulse">
        Loading post...
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 text-red-500">Post not found</div>
    );

  return (
    <>
      <Helmet>
        <title>{post.postTitle} | CodeCircle</title>
        <meta property="og:title" content={post.postTitle} />
        <meta property="og:description" content={post.postDescription} />
        <meta property="og:image" content={post.thumbnail || fallbackThumbnail} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-white rounded-2xl shadow-lg"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back
        </motion.button>

        <div className="flex items-center gap-4 mb-4">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={post.authorImage || "/default-profile.png"}
            alt={post.authorName}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <h3 className="font-semibold text-lg">{post.authorName}</h3>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-3 text-indigo-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {post.postTitle}
        </motion.h1>

        <p className="mb-4 text-gray-700 leading-relaxed">
          {post.postDescription}
        </p>
        <p className="mb-6">
          Tag:{" "}
          <span className="text-indigo-600 font-semibold">#{post.tag}</span>
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-8">
          <button
            disabled={voteLoading}
            onClick={() => handleVote("upvote")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            👍 Upvote ({post.upVote})
          </button>
          <button
            disabled={voteLoading}
            onClick={() => handleVote("downvote")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            👎 Downvote ({post.downVote})
          </button>

          {/* Facebook Share Link */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="fb"
              className="w-5 h-5"
            />
            Share on Facebook
          </a>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Comments ({comments.length})
          </h2>

          {user ? (
            <div className="mb-6">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-indigo-500"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Comment
              </button>
            </div>
          ) : (
            <p className="mb-4 text-red-600">You must be logged in to comment.</p>
          )}

          {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}

          <ul className="space-y-4">
            {comments.map((c, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border p-3 rounded-lg bg-gray-50"
              >
                <p className="text-gray-800">
                  {c.commentText.length > 20 ? (
                    <>
                      {c.commentText.slice(0, 20)}...
                      <button
                        onClick={() => openModal(c.commentText)}
                        className="ml-2 text-blue-600 underline"
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    c.commentText
                  )}
                </p>
                <small className="text-gray-500">
                  by {c.commenterEmail} at{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Comment Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-32 outline-none"
        overlayClassName="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-xl font-bold mb-2 text-indigo-700">Full Comment</h3>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{modalComment}</p>
        <button
          onClick={closeModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Close
        </button>
      </Modal>
    </>
  );
};

export default PostDetails;
