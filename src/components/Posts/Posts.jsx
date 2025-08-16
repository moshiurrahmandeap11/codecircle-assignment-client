import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router';
import Loader from '../Loader/Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByPopular, setSortByPopular] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://code-circle-server-three.vercel.app/posts?popular=${sortByPopular}`);
      const dataWithComments = await Promise.all(
        res.data.map(async (post) => {
          const commentRes = await axios.get(`https://code-circle-server-three.vercel.app/comments/count?title=${post.postTitle}`);
          return { ...post, commentCount: commentRes.data.count || 0 };
        })
      );
      setPosts(dataWithComments);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchPosts();
  }, [sortByPopular]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6" data-aos="fade-down">
        <h2 className="text-2xl font-bold text-indigo-700">Forum Posts</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => setSortByPopular(prev => !prev)}
        >
          Sort by {sortByPopular ? 'Newest' : 'Popularity'}
        </button>
      </div>

      {loading ? (
        <div className="text-center text-indigo-500"><Loader></Loader></div>
      ) : (
        <div className="space-y-6">
          {currentPosts.map(post => (
            <div
              key={post._id}
              className="bg-white shadow rounded p-5 cursor-pointer hover:bg-indigo-50"
              data-aos="fade-up"
              onClick={() => navigate(`/dashboard/post/${post._id}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={post.authorImage} alt="author" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-semibold">{post.authorName}</h4>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-indigo-700 mb-2">{post.postTitle}</h3>
              <p className="text-sm text-gray-600 mb-2">Tag: <span className="text-indigo-600 font-medium">#{post.tag}</span></p>
              <div className="flex justify-between text-sm">
                <p>🗨️ {post.commentCount} Comments</p>
                <p>⬆️ {post.upVote} | ⬇️ {post.downVote} | Total Votes: {post.upVote - post.downVote}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-indigo-100'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Posts;
