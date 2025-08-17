import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });

    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://code-circle-server-three.vercel.app/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostDetails = (postId) => {
    navigate(`/dashboard/post/${postId}`);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = posts.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <p className="text-center text-gray-400 font-semibold mt-10">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-400 italic mt-10">No posts found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-6 text-gray-200 font-sans">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">📬 All Posts</h2>

      <div  className="max-w-4xl mx-auto space-y-6">
        {currentItems.map((post, index) => (
          <div
            key={post._id}
            onClick={() => handlePostDetails(post._id)}
            className="bg-[rgba(30,41,59,0.3)] backdrop-blur-md cursor-pointer hover:scale-[1.03] transition-all duration-100 rounded-xl shadow-lg p-6 border border-[rgba(255,255,255,0.05)]"
            data-aos="fade-up"
            data-aos-delay={index * 60}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(255,255,255,0.1)]"
              />
              <div>
                <p className="text-gray-100 font-semibold">{post.authorName}</p>
                <p className="text-gray-400 text-sm">{post.authorEmail}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">{post.postTitle}</h3>
            <p className="text-gray-300 mb-4">{post.postDescription}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-sm">
                <span className="bg-[rgba(99,102,241,0.2)] text-gray-100 px-2 py-1 rounded-lg">{post.tag}</span>
                <span className="text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-300">👍 {post.upVote}</span>
                <span className="text-gray-300">👎 {post.downVote}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length > ITEMS_PER_PAGE && (
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

export default AllPosts;