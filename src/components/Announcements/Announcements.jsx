import axios from "axios";
import React, { useEffect, useState } from "react";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://code-circle-server-three.vercel.app/announcements");
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };
    fetchData();
  }, []);

  if (announcements.length === 0)
    return (
      <div className="max-w-6xl mx-auto p-6 relative">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">📢</div>
          <p className="text-white/60 text-lg">No announcements yet.</p>
          <p className="text-white/40 text-sm mt-2">Stay tuned for updates!</p>
        </div>
      </div>
    );

  const prevSlide = () => {
    setCurrentIndex((idx) => (idx === 0 ? announcements.length - 1 : idx - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((idx) => (idx === announcements.length - 1 ? 0 : idx + 1));
  };

  const current = announcements[currentIndex];

  return (
    <div className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto p-6 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-900/20 to-slate-800/30 rounded-3xl" />
      
      {/* Main glass container */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        
        {/* Header with enhanced styling */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
            📢 Announcements
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Stay updated with the latest news and updates
          </p>
        </div>

        {/* Announcement content with glass effect */}
        <div className="relative w-full h-[60vh] sm:h-[400px] p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
          
          {/* Content area */}
          <div className="h-full flex flex-col justify-between">
            <div
              className="overflow-y-auto pr-2 custom-scrollbar flex-1"
              style={{ maxHeight: "calc(60vh - 100px)", scrollBehavior: "smooth" }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white/95 leading-tight">
                {current.title}
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="mt-2 whitespace-pre-line text-sm sm:text-base text-white/80 leading-relaxed">
                  {current.description}
                </p>
              </div>
            </div>

            {/* Author and date info */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {current.authorName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-white/70 text-sm font-medium">
                  {current.authorName}
                </span>
              </div>
              
              <div className="text-white/50 text-xs sm:text-sm flex items-center gap-1">
                <span>📅</span>
                <span>{new Date(current.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
        </div>

        {/* Enhanced navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50 group"
          aria-label="Previous Announcement"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">◀</span>
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50 group"
          aria-label="Next Announcement"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">▶</span>
        </button>

        {/* Slide indicators */}
        {announcements.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-purple-400 w-6'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating decoration elements */}
      <div className="absolute top-8 left-8 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse blur-sm" />
      <div className="absolute top-12 right-12 w-2 h-2 bg-pink-400/30 rounded-full animate-ping blur-sm" />
      <div className="absolute bottom-12 left-12 w-4 h-4 bg-blue-400/15 rounded-full animate-pulse blur-sm" />
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Announcements;