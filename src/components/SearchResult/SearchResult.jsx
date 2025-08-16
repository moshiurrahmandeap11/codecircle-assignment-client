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
    <div className="p-6 max-w-5xl mx-auto">
<h2 className="text-2xl font-semibold mb-6">
  {searchQuery.startsWith('#') ? 'Posts tagged with:' : 'Search Results for:'}
  <span className="text-blue-600"> "{searchQuery}"</span>
</h2>


      {loading && <p className="text-indigo-500">Loading results...</p>}

{!loading && results.length === 0 && (
  <div className="text-center mt-10">
    <p className="text-lg text-gray-600 font-semibold mb-4">
      ❌ Nothing found on search.
    </p>
    <button
      onClick={() => navigate("/")}
      className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
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
            className="border p-5 rounded-xl mb-6 shadow-sm bg-white"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={post.authorImage || "/default-profile.png"}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <h4 className="font-medium text-sm">{post.authorName}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-indigo-700 mb-2">
              {post.postTitle}
            </h3>

            <p className="text-gray-700 mb-2">
              {post.postDescription?.slice(0, 200)}...
            </p>

            <p className="mb-3">
              Tag: <span className="text-indigo-600 font-medium">#{post.tag}</span>
            </p>

            <div className="flex items-center gap-4 mb-3">
              <span className="text-green-600">👍 {post.upVote}</span>
              <span className="text-red-600">👎 {post.downVote}</span>
            </div>

            <button
              onClick={() => navigate(`/dashboard/post/${post._id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Read More →
            </button>
          </motion.div>
        ))}
    </div>
  );
};

export default SearchResult;
