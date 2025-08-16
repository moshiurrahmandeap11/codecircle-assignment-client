import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      axios
        .get(`https://code-circle-server-three.vercel.app/search?q=${searchQuery}`)
        .then((res) => {
          setResults(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white px-4 py-12 md:px-8 lg:px-20 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
            {searchQuery.startsWith('#') ? 'Posts tagged with:' : 'Search Results for:'}
            <span className="text-indigo-300"> "{searchQuery}"</span>
          </h2>
        </motion.div>

        {loading && <p className="text-indigo-300 text-center">Loading results...</p>}

        {!loading && results.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-300 font-semibold mb-4">
              ❌ Nothing found on search.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              🔙 Go to Home
            </button>
          </div>
        )}

        {!loading &&
          results.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-lg p-5 rounded-xl mb-6 shadow-2xl border border-white/20 group perspective-1000 transition-all duration-300 relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateZ(20px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateX(0) rotateY(0) scale(1) translateZ(0)';
              }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-center gap-4 mb-3 relative z-10">
                <img
                  src={post.authorImage || "/default-profile.png"}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-medium text-sm text-white">{post.authorName}</h4>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-indigo-300 mb-2 relative z-10">
                {post.postTitle}
              </h3>

              <p className="text-gray-200 mb-2 relative z-10">
                {post.postDescription?.slice(0, 200)}...
              </p>

              <p className="mb-3 relative z-10">
                Tag: <span className="text-indigo-400 font-medium">#{post.tag}</span>
              </p>

              <div className="flex items-center gap-4 mb-3 relative z-10">
                <span className="text-green-400">👍 {post.upVote}</span>
                <span className="text-red-400">👎 {post.downVote}</span>
              </div>

              <button
                onClick={() => navigate(`/dashboard/post/${post._id}`)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 relative z-10"
              >
                Read More →
              </button>
            </motion.div>
          ))}

        <div className="text-center text-sm text-gray-300 mt-12">
          <p>
            📬{' '}
            <a href="mailto:support@codecircle.com" className="underline hover:text-indigo-200">
              support@codecircle.com
            </a>
          </p>
          <p className="mt-1">📍 Dhaka, Bangladesh</p>
        </div>
      </div>

      {/* Inline CSS for perspective effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default SearchResult;