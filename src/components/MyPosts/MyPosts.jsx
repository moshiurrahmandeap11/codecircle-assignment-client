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

  if (loading) return <div className="text-center py-20 text-indigo-500">Loading posts...</div>;

  if (!posts.length) {
    return (
      <div className="text-center py-20 text-gray-600" data-aos="fade-up">
        <p className="text-lg font-medium">You haven’t created any posts yet.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6" data-aos="fade-down">
        <h2 className="text-2xl font-bold text-indigo-700"> My Posts</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          ← Back
        </button>
      </div>

      <div className="overflow-x-auto" data-aos="fade-up">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700 text-left text-sm">
              <th className="py-3 px-4">Post Title</th>
              <th className="py-3 px-4 text-center">Votes</th>
              <th className="py-3 px-4 text-center">Comment</th>
              <th className="py-3 px-4 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map(post => (
              <tr key={post._id} className="border-t hover:bg-gray-50 text-sm transition-all">
                <td className="py-3 px-4">{post.postTitle}</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-green-600 font-semibold">{post.upVote}</span> ↑ /{' '}
                  <span className="text-red-500 font-semibold">{post.downVote}</span> ↓
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/comments/${post._id}`)}
                    className="text-indigo-600 hover:underline"
                  >
                    Comment
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4 items-center text-sm font-medium">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
