import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = ({ userEmail, onRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/notifications?userEmail=${userEmail}`);
        setNotifications(res.data);

        if (res.data.some(n => !n.isRead)) {
          onRead?.(); 
          await axios.patch(`https://code-circle-server-three.vercel.app/notifications/mark-read`, { userEmail });
        }
      } catch (err) {
        console.error("❌ Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userEmail, onRead]);

  const handleClearNotifications = async () => {
    if (!userEmail) return;

    const confirm = window.confirm("Are you sure you want to clear all notifications?");
    if (!confirm) return;

    try {
      setArchiving(true);
      await axios.post("https://code-circle-server-three.vercel.app/notifications/archive", { userEmail });
      setNotifications([]);
    } catch (err) {
      console.error("❌ Failed to archive notifications:", err);
      alert("Failed to clear notifications");
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center">
          <div className="text-white/70 text-sm">Loading notifications...</div>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-center text-white/60 text-sm">No notifications</div>
      </div>
    );
  }

  return (
    <div className="notifications-container backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent blur-sm -z-10"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white/90">Notifications</h3>
        <button
          onClick={handleClearNotifications}
          className="text-sm text-red-400 hover:text-red-300 transition-colors duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={archiving}
        >
          {archiving ? "Clearing..." : "Clear All"}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {notifications.map((n, index) => (
          <div
            key={n._id}
            className={`notification relative backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] group
              ${n.isRead 
                ? "bg-white/5 border border-white/10" 
                : "bg-white/10 border border-white/20"
              } 
              rounded-xl p-4 shadow-lg hover:bg-white/10`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Unread indicator */}
            {!n.isRead && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}

            {/* Content */}
            <div className="pr-4">
              <p className={`text-sm transition-colors duration-300 group-hover:text-white
                ${n.isRead ? "text-white/70" : "text-white/90"}
              `}>
                {n.message}
              </p>
              
              <small className="text-xs text-white/50 mt-2 block">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Notification;