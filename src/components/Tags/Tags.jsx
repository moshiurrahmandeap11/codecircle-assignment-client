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
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        🔖 Explore Tags
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading tags...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : tags.length === 0 ? (
        <p className="text-center text-gray-500">No tags available yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((t) => (
            <button
              key={t._id}
              onClick={() => handleTagClick(t.tag)} 
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-all duration-200 shadow-sm"
            >
              #{t.tag}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Tags;
