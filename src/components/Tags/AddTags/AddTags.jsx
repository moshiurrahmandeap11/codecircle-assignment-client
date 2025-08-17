import React, { useState } from 'react';
import axios from 'axios';

const AddTags = () => {
  const [tag, setTag] = useState('');
  const [message, setMessage] = useState('');

  const handleAddTag = async (e) => {
    e.preventDefault();

    if (!tag.trim()) {
      setMessage("🚫 Tag can't be empty.");
      return;
    }

    try {
      const res = await axios.post('https://code-circle-server-three.vercel.app/tags', { tag: tag.trim() });
      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Tag added successfully!');
        setTag('');
      } else {
        setMessage('⚠️ Failed to add tag. Try again.');
      }
    } catch (err) {
      console.error('❌ Error adding tag:', err);
      setMessage('❌ Server error. Please try later.');
    }
  };

  return (
    <div className="min-h-screen  p-6 flex items-center justify-center">
      <div className="mt-12 p-6 bg-[rgba(30,41,59,0.3)] backdrop-blur-md rounded-xl shadow-2xl text-gray-200 w-full max-w-md border border-[rgba(255,255,255,0.05)]">
        <h3 className="text-xl font-bold mb-4 text-gray-100">Add New Tag</h3>

        <form onSubmit={handleAddTag} className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag name"
            className="px-4 py-2 w-full md:w-1/2 rounded-lg bg-[rgba(17,24,39,0.5)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-[rgba(99,102,241,0.3)] text-gray-100 placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[rgba(99,102,241,0.5)] backdrop-blur-md hover:bg-[rgba(99,102,241,0.7)] rounded-lg shadow text-gray-100 font-medium transition-colors border border-[rgba(255,255,255,0.1)]"
          >
            Add Tag
          </button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddTags;