import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; 

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  console.log(tags);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("https://code-circle-server-three.vercel.app/tags");
        setTags(res.data);
      } catch (err) {
        setError("Failed to load tags");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    navigate(`/search?q=${tag}`); 
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-gray-900/10 to-slate-800/20 rounded-3xl" />
      
      {/* Glass container */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
        {/* Enhanced heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
            🔖 Explore Tags
          </h2>
          <p className="text-white/70 text-lg">
            Discover trending topics and find your community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-4"></div>
            <p className="text-white/60 text-lg">Loading tags...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-400/20 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-white/60 text-lg">No tags available yet.</p>
              <p className="text-white/40 text-sm mt-2">Be the first to create content!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {tags.map((t, index) => (
              <button
                key={t._id}
                onClick={() => handleTagClick(t.tag)} 
                className="group relative px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 rounded-2xl transition-all duration-300" />
                
                {/* Tag content */}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-purple-400 group-hover:text-purple-300">#</span>
                  <span className="group-hover:text-white/95">{t.tag}</span>
                </span>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse rounded-2xl" />
              </button>
            ))}
          </div>
        )}

        {/* Stats section if tags exist */}
        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{tags.length}</div>
                <div className="text-white/60 text-sm">Total Tags</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">∞</div>
                <div className="text-white/60 text-sm">Possibilities</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-pink-400 mb-1">🚀</div>
                <div className="text-white/60 text-sm">Trending</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating decoration elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse blur-sm" />
      <div className="absolute top-20 right-20 w-2 h-2 bg-pink-400/30 rounded-full animate-ping blur-sm" />
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse blur-sm" />
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-purple-300/25 rounded-full animate-ping blur-sm" />
    </section>
  );
};

export default Tags;