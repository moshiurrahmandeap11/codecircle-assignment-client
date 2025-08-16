import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import bannerVideo from "../../../src/assets/video.mp4";
import sponsor1 from "../../../src/assets/image1.jpg";
import sponsor2 from "../../../src/assets/image2.png";
import sponsor3 from "../../../src/assets/image3.jpg";
import axios from "axios";
import { useNavigate } from "react-router";

const phrases = [
  "Welcome to CodeCircle 💻",
  "Learn. Share. Build. 🚀",
  "Connect with Devs Worldwide 🌍",
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

      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="text-center max-w-3xl text-white animate-fade-in-up">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 drop-shadow-xl">
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

          <p className="text-lg md:text-xl font-medium drop-shadow mb-6">
            A place to connect, discuss, and grow as a developer
          </p>

          {/* Search Box */}
          <div className="mt-4 flex flex-col items-center justify-center relative">
            <div className="flex w-full max-w-md">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search threads, topics, or users..."
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-l-md text-white placeholder-white focus:outline-none shadow-md backdrop-blur-md"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-md shadow-md transition-all"
              >
                Search
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full w-full max-w-md bg-white shadow-md rounded-b-md z-20 mt-1 text-left overflow-hidden">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setSearchText(item.postTitle);
                      navigate(`/search-result?q=${item.postTitle}`);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  >
                    {item.postTitle}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Sponsors */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md shadow-md">
        <img src={sponsor1} alt="Sponsor 1" className="w-10 h-10 object-contain" />
        <img src={sponsor2} alt="Sponsor 2" className="w-10 h-10 object-contain" />
        <img src={sponsor3} alt="Sponsor 3" className="w-10 h-10 object-contain" />
      </div>
    </div>
  );
};

export default Banner;
