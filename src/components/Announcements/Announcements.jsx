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
    return <p className="text-center py-10">No announcements yet.</p>;

  const prevSlide = () => {
    setCurrentIndex((idx) => (idx === 0 ? announcements.length - 1 : idx - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((idx) => (idx === announcements.length - 1 ? 0 : idx + 1));
  };

  const current = announcements[currentIndex];

  return (
    <div className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto p-6 bg-indigo-600 rounded-lg shadow-lg text-white relative">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">📢 Announcement</h2>


      <div className="w-full h-[60vh] sm:h-[400px] p-4 flex flex-col justify-between rounded-md bg-indigo-700 shadow-inner max-w-full mx-auto">
        <div
          className="overflow-y-auto pr-2"
          style={{ maxHeight: "calc(60vh - 80px)", scrollBehavior: "smooth" }}
        >
          <h3 className="text-lg sm:text-xl font-semibold">{current.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm sm:text-base">{current.description}</p>
        </div>

        <p className="mt-4 text-xs sm:text-sm opacity-80">
          By: {current.authorName} | {new Date(current.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-indigo-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 shadow-md"
        aria-label="Previous Announcement"
      >
        ◀
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-indigo-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 shadow-md"
        aria-label="Next Announcement"
      >
        ▶
      </button>
    </div>
  );
};

export default Announcements;
