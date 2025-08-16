import React, { useEffect, useState } from 'react';
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import axios from 'axios';
import { useNavigate } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

const POSTS_PER_PAGE = 10;

const MyPosts = () => {
  const { user } = UseAuthHook();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800 });
    if (!user?.email) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/posts?authorEmail=${user.email}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.email]);

  const handleDelete = async (postId) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await axios.delete(`https://code-circle-server-three.vercel.app/posts/${postId}?email=${user.email}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Could not delete post");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center text-white/80 text-lg">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center max-w-md" data-aos="fade-up">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <p className="text-lg font-medium text-white/90 mb-6">You haven't created any posts yet.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8" data-aos="fade-down">
          <h2 className="text-3xl font-bold text-white/90">My Posts</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
          >
            ← Back
          </button>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl" data-aos="fade-up">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 via-gray-500/10 to-white/10 blur-sm -z-10"></div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Post Title</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-white/80">Votes</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-white/80">Comment</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-white/80">Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post, index) => (
                  <tr 
                    key={post._id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="py-4 px-6 text-white/90 group-hover:text-white transition-colors">
                      {post.postTitle}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-400 font-semibold">{post.upVote}</span>
                        <span className="text-white/60">↑</span>
                        <span className="text-white/40">/</span>
                        <span className="text-red-400 font-semibold">{post.downVote}</span>
                        <span className="text-white/60">↓</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => navigate(`/comments/${post._id}`)}
                        className="text-white/70 hover:text-white hover:underline transition-all duration-300 hover:scale-105"
                      >
                        Comment
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-red-400 hover:text-red-300 hover:underline transition-all duration-300 hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4 items-center" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              ← Prev
            </button>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-white/70">
                Page <span className="font-semibold text-white">{currentPage}</span> of {totalPages}
              </span>
            </div>
            
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;