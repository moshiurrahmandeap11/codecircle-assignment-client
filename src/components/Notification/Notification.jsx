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

  if (loading) return <div>Loading notifications...</div>;
  if (notifications.length === 0) return <div>No notifications</div>;

  return (
    <div className="notifications-container space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={handleClearNotifications}
          className="text-sm text-red-500 hover:underline"
          disabled={archiving}
        >
          {archiving ? "Clearing..." : "Clear All"}
        </button>
      </div>

      {notifications.map((n) => (
        <div
          key={n._id}
          className={`notification ${n.type} ${n.isRead ? "read" : "unread"} bg-gray-100 p-2 shadow-md rounded-md`}
        >
          <p>{n.message}</p>
          <small className="text-xs text-gray-500">
            {new Date(n.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Notification;
