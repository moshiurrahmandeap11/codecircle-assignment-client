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
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-gray-900/10 to-slate-800/20 rounded-3xl" />
      
      {/* Main glass container */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8">
        
        {/* Header section with enhanced styling */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" data-aos="fade-down">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
              Forum Posts
            </h2>
            <p className="text-white/60 text-sm sm:text-base">
              Discover trending discussions and join the conversation
            </p>
          </div>
          
          <button
            className="group relative px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            onClick={() => setSortByPopular(prev => !prev)}
          >
            <span className="relative z-10">
              Sort by {sortByPopular ? 'Newest' : 'Popularity'}
            </span>
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 rounded-2xl transition-all duration-300" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <Loader />
            </div>
            <p className="text-white/60 text-lg">Loading amazing posts...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentPosts.map((post, index) => (
              <div
                key={post._id}
                className="group relative bg-white/8 backdrop-blur-md hover:bg-white/15 border border-white/10 hover:border-white/25 shadow-lg hover:shadow-2xl rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onClick={() => navigate(`/dashboard/post/${post._id}`)}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:via-pink-600/5 group-hover:to-purple-600/5 transition-all duration-500" />
                
                {/* Author info */}
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={post.authorImage} 
                      alt="author" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
                      {post.authorName}
                    </h4>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <span>🕒</span>
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Post title */}
                <h3 className="relative z-10 text-xl font-bold text-white/95 mb-3 group-hover:text-white transition-colors duration-300 leading-tight">
                  {post.postTitle}
                </h3>

                {/* Tag */}
                <div className="relative z-10 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-purple-300 font-medium">
                    <span>#</span>
                    {post.tag}
                  </span>
                </div>

                {/* Post stats */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-lg">
                      <span>💬</span>
                      <span>{post.commentCount} Comments</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                      <span className="text-green-400">⬆️ {post.upVote}</span>
                      <span className="text-red-400">⬇️ {post.downVote}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-lg">
                      <span className="text-white/80 font-medium">
                        Score: {post.upVote - post.downVote}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000 ease-out" />
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-10 pt-8 border-t border-white/10">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              ←
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 font-medium ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 text-white'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              →
            </button>
          </div>
        )}

        {/* Posts summary */}
        {posts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{posts.length}</div>
                <div className="text-white/60 text-sm">Total Posts</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {Math.round(posts.reduce((acc, post) => acc + post.commentCount, 0) / posts.length) || 0}
                </div>
                <div className="text-white/60 text-sm">Avg Comments</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-pink-400 mb-1">
                  {posts.reduce((acc, post) => acc + (post.upVote - post.downVote), 0)}
                </div>
                <div className="text-white/60 text-sm">Total Score</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating decoration elements */}
      <div className="absolute top-8 left-8 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse blur-sm" />
      <div className="absolute top-16 right-16 w-2 h-2 bg-pink-400/30 rounded-full animate-ping blur-sm" />
      <div className="absolute bottom-16 left-16 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse blur-sm" />
      <div className="absolute bottom-8 right-8 w-2 h-2 bg-purple-300/25 rounded-full animate-ping blur-sm" />
    </div>
  );
};

export default Posts;