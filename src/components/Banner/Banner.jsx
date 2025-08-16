import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import bannerVideo from "../../../src/assets/video.mp4";
import sponsor1 from "../../../src/assets/image1.jpg";
import sponsor2 from "../../../src/assets/image2.png";
import sponsor3 from "../../../src/assets/image3.jpg";
import axios from "axios";
import { useNavigate } from "react-router";

const phrases = [
  "Welcome to CodeCircle ",
  "Learn. Share. Build. ",
  "Connect with Devs Worldwide ",
];

const Banner = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim()) {
        axios
          .get(`https://code-circle-server-three.vercel.app/search-suggestions?q=${searchText}`)
          .then((res) => setSuggestions(res.data))
          .catch(console.error);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search-result?q=${searchText}`);
    }
  };

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={bannerVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Enhanced dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-gray-900/60 to-black/80 z-[1]" />
      
      {/* Additional radial gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl text-white animate-fade-in-up">
          {/* Main heading with enhanced styling */}
          <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              <span className="whitespace-nowrap font-bold">
                <Typewriter
                  words={phrases}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={40}
                  delaySpeed={2000}
                />
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-lg mb-8">
              A place to connect, discuss, and grow as a developer
            </p>

            {/* Enhanced Search Box */}
            <div className="mt-6 flex flex-col items-center justify-center relative" id="banner-search">
              <div className="flex w-full max-w-lg group">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search threads, topics, or users..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-l-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/40 shadow-xl transition-all duration-300 group-hover:bg-white/15"
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-r-2xl shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  Search
                </button>
              </div>

              {/* Enhanced Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full w-full max-w-lg bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-2xl z-20 mt-2 text-left overflow-hidden border border-white/10">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSearchText(item.postTitle);
                        navigate(`/search-result?q=${item.postTitle}`);
                      }}
                      className="px-6 py-4 hover:bg-white/10 cursor-pointer text-white/90 hover:text-white transition-all duration-200 border-b border-white/5 last:border-b-0"
                    >
                      {item.postTitle}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Sponsors section */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/10">
        <span className="text-white/70 text-sm font-medium mr-2">Sponsored by:</span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={sponsor1} alt="Sponsor 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={sponsor2} alt="Sponsor 2" className="w-full h-full object-cover" />
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={sponsor3} alt="Sponsor 3" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-300/30 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default Banner;