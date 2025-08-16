import React, { useEffect, useState } from 'react';
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
        console.error(" Error fetching user/post info:", err);
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
        console.error(' Failed to fetch tags:', err);
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
      toast.success(' Post submitted successfully!');
      navigate('/');
    } catch (err) {
      console.error('Failed to add post', err);
      toast.error(' Failed to add post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = badge === "Bronze" && postCount >= 5;

  if (loading) return <Loader></Loader>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow" data-aos="zoom-in">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-indigo-600 hover:underline transition duration-200"
      >
        ← Back
      </button>

      <h2 className="text-2xl mb-4 font-bold text-indigo-700" data-aos="fade-up">
         Add a New Post
      </h2>

      <p className="mb-6 text-sm text-gray-600">
         Your Badge: <strong>{badge}</strong> | 📝 Posts Created: <strong>{postCount}</strong>
      </p>

      {isLimitReached && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6" data-aos="fade-up">
          You’ve hit the free post limit for Bronze members (5 posts). Upgrade your membership to post more!
          <br />
          <button
            onClick={() => navigate('/membership')}
            className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Become a Member
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Author Image URL" name="authorImage" value={formData.authorImage} onChange={handleChange} />
        <Input label="Author Name" name="authorName" value={formData.authorName} readOnly />
        <Input label="Author Email" name="authorEmail" value={formData.authorEmail} readOnly />
        <Input label="Post Title" name="postTitle" value={formData.postTitle} onChange={handleChange} required />
        
        <div data-aos="fade-up" data-aos-delay="300">
          <label className="block mb-1 font-medium">Post Description</label>
          <textarea
            name="postDescription"
            value={formData.postDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-indigo-500"
            rows={5}
            required
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="350">
          <label className="block mb-1 font-medium">Tag</label>
          <Select
            options={tags}
            value={formData.tag}
            onChange={handleTagChange}
            placeholder="Select a tag"
            isClearable
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <button
            type="submit"
            disabled={isSubmitting || isLimitReached}
            title={
              isLimitReached
                ? "You’ve reached your post limit. Upgrade to post more."
                : ""
            }
            className={`w-full py-2 rounded text-white transition duration-300 ${
              isSubmitting || isLimitReached
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Add Post'}
          </button>
        </div>
      </form>
    </div>
  );
};


const Input = ({ label, ...props }) => (
  <div data-aos="fade-up" data-aos-delay="150">
    <label className="block mb-1 font-medium">{label}</label>
    <input
      {...props}
      className="w-full border px-3 py-2 rounded focus:outline-indigo-500"
    />
  </div>
);

export default AddPost;
