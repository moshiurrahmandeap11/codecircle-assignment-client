import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import UseAuthHook from '../../hooks/contexthooks/UseAuthHook';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';

const AddPost = () => {
  const { user } = UseAuthHook();
  const navigate = useNavigate();

  const [postCount, setPostCount] = useState(0);
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    authorImage: '',
    authorName: '',
    authorEmail: '',
    postTitle: '',
    postDescription: '',
    tag: null,
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchUserPostInfo = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get(`https://code-circle-server-three.vercel.app/users`),
          axios.get(`https://code-circle-server-three.vercel.app/posts?authorEmail=${user.email}`),
        ]);

        const currentUser = userRes.data.find(u => u.email === user.email);
        if (!currentUser) return toast.error("User not found");

        setBadge(currentUser.badge || "Bronze");
        setPostCount(postRes.data.length);
      } catch (err) {
        console.error("Error fetching user/post info:", err);
        toast.error("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPostInfo();
  }, [user?.email]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get('https://code-circle-server-three.vercel.app/tags');
        const tagOptions = res.data.map(tag => ({ value: tag.tag, label: tag.tag }));
        setTags(tagOptions);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);

  // Prefill user info
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        authorImage: user.photoURL || '',
        authorName: user.displayName || '',
        authorEmail: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = selectedOption => {
    setFormData(prev => ({ ...prev, tag: selectedOption }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (badge === "Bronze" && postCount >= 5) {
      return toast.error("Bronze users can only post 5 times. Upgrade to Gold!");
    }

    if (!formData.postTitle || !formData.postDescription || !formData.tag) {
      return toast.error('Please fill in all required fields');
    }

    const payload = {
      authorImage: formData.authorImage,
      authorName: formData.authorName,
      authorEmail: formData.authorEmail,
      postTitle: formData.postTitle,
      postDescription: formData.postDescription,
      tag: formData.tag.value,
      upVote: 0,
      downVote: 0,
      createdAt: new Date(),
    };

    setIsSubmitting(true);
    try {
      await axios.post('https://code-circle-server-three.vercel.app/posts', payload);
      toast.success('Post submitted successfully!');
      navigate('/');
    } catch (err) {
      console.error('Failed to add post', err);
      toast.error('Failed to add post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = badge === "Bronze" && postCount >= 5;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-12 md:px-8 lg:px-20 flex items-center justify-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 group perspective-1000 transition-all duration-300 relative overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateX(0) rotateY(0) scale(1) translateZ(0)';
        }}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-indigo-300 hover:text-indigo-200 underline transition-all duration-200 relative z-10"
          data-aos="fade-up"
        >
          ← Back
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg relative z-10" data-aos="fade-up">
          Add a New Post
        </h2>

        <p className="mb-6 text-sm text-gray-300 relative z-10" data-aos="fade-up" data-aos-delay="100">
          Your Badge: <strong>{badge}</strong> | 📝 Posts Created: <strong>{postCount}</strong>
        </p>

        {isLimitReached && (
          <div
            className="bg-yellow-100/10 text-yellow-300 p-4 rounded-lg mb-6 border border-yellow-300/20 relative z-10"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            You’ve hit the free post limit for Bronze members (5 posts). Upgrade your membership to post more!
            <br />
            <button
              onClick={() => navigate('/membership')}
              className="mt-2 inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              Become a Member
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <Input
            label="Author Image URL"
            name="authorImage"
            value={formData.authorImage}
            onChange={handleChange}
            aosDelay="200"
          />
          <Input
            label="Author Name"
            name="authorName"
            value={formData.authorName}
            readOnly
            aosDelay="250"
          />
          <Input
            label="Author Email"
            name="authorEmail"
            value={formData.authorEmail}
            readOnly
            aosDelay="300"
          />
          <Input
            label="Post Title"
            name="postTitle"
            value={formData.postTitle}
            onChange={handleChange}
            required
            aosDelay="350"
          />
          <div data-aos="fade-up" data-aos-delay="400">
            <label className="block mb-1 font-medium text-gray-200">Post Description</label>
            <textarea
              name="postDescription"
              value={formData.postDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
              rows={5}
              required
            />
          </div>
          <div data-aos="fade-up" data-aos-delay="450">
            <label className="block mb-1 font-medium text-gray-200">Tag</label>
            <Select
              options={tags}
              value={formData.tag}
              onChange={handleTagChange}
              placeholder="Select a tag"
              isClearable
              menuPlacement="top"
              aria-label="Select a tag for your post"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '0.375rem',
                  padding: '0.25rem',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#A5B4FC' },
                  boxShadow: 'none',
                  '&:focus': {
                    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)',
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: '#fff',
                }),
                placeholder: (base) => ({
                  ...base,
                  color: '#9CA3AF',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  marginTop: '-4px',
                  zIndex: 20,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? 'rgba(99, 102, 241, 0.5)'
                    : state.isFocused
                    ? 'rgba(99, 102, 241, 0.3)'
                    : 'transparent',
                  color: '#fff',
                  padding: '8px 12px',
                  transition: 'background-color 0.2s ease',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.4)' },
                }),
                menuList: (base) => ({
                  ...base,
                  padding: '4px',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: '#A5B4FC',
                  '&:hover': { color: '#C7D2FE' },
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: '#A5B4FC',
                  '&:hover': { color: '#C7D2FE' },
                }),
              }}
            />
          </div>
          <div data-aos="fade-up" data-aos-delay="500">
            <button
              type="submit"
              disabled={isSubmitting || isLimitReached}
              title={
                isLimitReached
                  ? "You’ve reached your post limit. Upgrade to post more."
                  : ""
              }
              className={`w-full py-2 rounded-lg text-white transition-all duration-300 ${
                isSubmitting || isLimitReached
                  ? 'bg-gray-500/50 cursor-not-allowed backdrop-blur-sm'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Post'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Inline CSS for perspective effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

const Input = ({ label, aosDelay, ...props }) => (
  <div data-aos="fade-up" data-aos-delay={aosDelay}>
    <label className="block mb-1 font-medium text-gray-200">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-gray-400"
    />
  </div>
);

export default AddPost;