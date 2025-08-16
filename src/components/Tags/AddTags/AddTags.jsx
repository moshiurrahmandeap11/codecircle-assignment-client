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
    <div className="mt-12 p-6 bg-[#111827] rounded-xl shadow-lg text-white">
      <h3 className="text-xl font-bold mb-4 text-indigo-400"> Add New Tag</h3>

      <form onSubmit={handleAddTag} className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Enter tag name"
          className="px-4 py-2 w-full md:w-1/2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow text-white font-medium transition"
        >
          Add Tag
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-indigo-300">{message}</p>
      )}
    </div>
  );
};

export default AddTags;
