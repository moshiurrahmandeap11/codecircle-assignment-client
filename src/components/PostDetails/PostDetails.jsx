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
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-900/20 to-slate-800/30" />
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-white/80 text-xl">Loading post...</p>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-900/20 to-slate-800/30" />
        <div className="relative bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-400/20 p-12 text-center shadow-2xl">
          <div className="text-6xl mb-4">😞</div>
          <p className="text-red-400 text-xl">Post not found</p>
        </div>
      </div>
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

      <div className="min-h-screen py-8 px-4 sm:px-6 relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gray-900 text-white" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main glass container */}
          <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 lg:p-10">
            
            {/* Back button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="group mb-8 px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:scale-110 transition-transform duration-200">←</span>
                <span>Back</span>
              </span>
            </motion.button>

            {/* Author section */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={post.authorImage || "/default-profile.png"}
                alt={post.authorName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
              />
              <div>
                <h3 className="font-semibold text-xl text-white/95">{post.authorName}</h3>
                <p className="text-sm text-white/60 flex items-center gap-1">
                  <span>🕒</span>
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Post title */}
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {post.postTitle}
            </motion.h1>

            {/* Post description */}
            <div className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-white/90 leading-relaxed text-lg">
                {post.postDescription}
              </p>
            </div>

            {/* Tag */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-purple-300 font-medium">
                <span className="text-lg">#</span>
                {post.tag}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 items-center mb-10">
              <button
                disabled={voteLoading}
                onClick={() => handleVote("upvote")}
                className="group px-6 py-3 bg-green-500/20 backdrop-blur-md hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">👍</span>
                  <span>Upvote ({post.upVote})</span>
                </span>
              </button>
              
              <button
                disabled={voteLoading}
                onClick={() => handleVote("downvote")}
                className="group px-6 py-3 bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">👎</span>
                  <span>Downvote ({post.downVote})</span>
                </span>
              </button>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 backdrop-blur-md hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="fb"
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                />
                <span>Share on Facebook</span>
              </a>
            </div>

            {/* Comments section */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white/95 flex items-center gap-2">
                <span>💬</span>
                Comments ({comments.length})
              </h2>

              {/* Comment form */}
              {user ? (
                <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/40 transition-all duration-300"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-2xl text-center">
                  <div className="text-4xl mb-2">🔐</div>
                  <p className="text-red-400 text-lg">You must be logged in to comment.</p>
                </div>
              )}

              {/* Comments list */}
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-white/60 text-lg">No comments yet.</p>
                  <p className="text-white/40 text-sm mt-2">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {comments.map((c, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {c.commenterEmail?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white/90 mb-3 leading-relaxed">
                            {c.commentText.length > 20 ? (
                              <>
                                {c.commentText.slice(0, 20)}...
                                <button
                                  onClick={() => openModal(c.commentText)}
                                  className="ml-2 text-purple-400 hover:text-purple-300 underline transition-colors duration-200"
                                >
                                  Read More
                                </button>
                              </>
                            ) : (
                              c.commentText
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-white/50">
                            <span>👤 {c.commenterEmail}</span>
                            <span>•</span>
                            <span>🕒 {new Date(c.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        {/* Floating decoration elements */}
        <div className="absolute top-12 left-12 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse blur-sm" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-pink-400/30 rounded-full animate-ping blur-sm" />
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse blur-sm" />
        <div className="absolute bottom-12 right-12 w-2 h-2 bg-purple-300/25 rounded-full animate-ping blur-sm" />
      </div>

      {/* Enhanced Comment Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl max-w-2xl mx-auto mt-32 outline-none"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="relative">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            💬 Full Comment
          </h3>
          <p className="text-white/90 mb-6 whitespace-pre-wrap leading-relaxed text-lg">
            {modalComment}
          </p>
          <button
            onClick={closeModal}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PostDetails;