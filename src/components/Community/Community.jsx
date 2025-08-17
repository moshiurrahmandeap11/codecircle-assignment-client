import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Reply, X } from "lucide-react";
import Swal from "sweetalert2";
import UseAuthHook from "../../hooks/contexthooks/UseAuthHook";

const Community = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = UseAuthHook();

  // Get display name and initials for fallback avatar
  const displayName = user?.fullName || user?.email || "Guest";
  const senderEmail = user?.email || "anonymous@guest.com";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Fetch messages periodically
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("https://code-circle-server-three.vercel.app/api/messages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to fetch messages",
            icon: "error",
            timer: 3000,
            background: "#1e293b",
            color: "#e5e7eb",
            toast: true,
            position: "top-end",
          });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append("text", messageText);
    formData.append("sender", senderEmail);
    if (selectedImage) formData.append("image", selectedImage);
    if (replyTo) formData.append("replyTo", JSON.stringify(replyTo));

    try {
      const response = await fetch("https://code-circle-server-three.vercel.app/api/messages", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessageText("");
        setSelectedImage(null);
        setReplyTo(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Fetch updated messages
        const res = await fetch("https://code-circle-server-three.vercel.app/api/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to send message",
          icon: "error",
          timer: 3000,
          background: "#1e293b",
          color: "#e5e7eb",
          toast: true,
          position: "top-end",
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to send message",
        icon: "error",
        timer: 3000,
        background: "#1e293b",
        color: "#e5e7eb",
        toast: true,
        position: "top-end",
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      Swal.fire({
        title: "Invalid File",
        text: "Please select an image file",
        icon: "warning",
        timer: 3000,
        background: "#1e293b",
        color: "#e5e7eb",
        toast: true,
        position: "top-end",
      });
    }
  };

  // Handle reply
  const handleReply = (message) => {
    setReplyTo({ id: message._id, sender: message.sender, text: message.text });
    setMessageText(`@${message.sender} `);
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Chat Header */}
      <div className="h-9 bg-[rgba(30,41,59,0.3)] backdrop-blur-md border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-4 text-gray-200 text-sm font-semibold">
        <span>CodeCircle Community Chat</span>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ background: "rgba(17,24,39,0.8)", backdropFilter: "blur(10px)" }}
      >
        {messages.map((msg) => {
          const msgInitials = msg.sender
            .split("@")[0]
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={msg._id}
              id={msg._id}
              className="mb-4 p-3 rounded-lg bg-[rgba(45,55,72,0.5)] text-gray-200"
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.sender === senderEmail && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                    {msgInitials}
                  </div>
                )}
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-indigo-400">
                    {msg.sender === senderEmail ? displayName : msg.sender}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              {msg.replyTo && (
                <div
                  className="mt-1 p-2 bg-[rgba(99,102,241,0.2)] rounded text-sm text-gray-300 cursor-pointer"
                  onClick={() =>
                    document.getElementById(msg.replyTo.id)?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Replying to @{msg.replyTo.sender}: {msg.replyTo.text.substring(0, 50)}...
                </div>
              )}
              <p className="mt-1">{msg.text}</p>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Uploaded" className="mt-2 max-w-xs rounded" />
              )}
              <button
                onClick={() => handleReply(msg)}
                className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Reply size={12} /> Reply
              </button>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[rgba(30,41,59,0.3)] backdrop-blur-md border-t border-[rgba(255,255,255,0.1)]">
        {replyTo && (
          <div className="mb-2 p-2 bg-[rgba(99,102,241,0.2)] rounded text-sm text-gray-200 flex items-center justify-between">
            <span>Replying to @{replyTo.sender}: {replyTo.text.substring(0, 50)}...</span>
            <X size={16} className="cursor-pointer" onClick={() => setReplyTo(null)} />
          </div>
        )}
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[rgba(45,55,72,0.5)] text-gray-200 border border-[rgba(255,255,255,0.1)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer text-gray-200 hover:text-indigo-400">
            <ImageIcon size={20} />
          </label>
          <button type="submit" className="text-gray-200 hover:text-indigo-400">
            <Send size={20} />
          </button>
        </form>
        {selectedImage && (
          <div className="mt-2 text-sm text-gray-400">
            Selected: {selectedImage.name}
            <X
              size={16}
              className="ml-2 cursor-pointer inline"
              onClick={() => {
                setSelectedImage(null);
                fileInputRef.current.value = "";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;