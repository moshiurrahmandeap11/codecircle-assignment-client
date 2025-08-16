import React from 'react';
import Typical from 'react-typical';

const Contact = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-indigo-700 text-white px-4 py-12 md:px-8 lg:px-24">
      <div data-aos="fade-down" className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          <Typical
            steps={['Let’s Talk 👋', 1500, 'Send Us a Message 💬', 1500, 'We’d Love to Hear From You ❤️', 2000]}
            loop={Infinity}
            wrapper="span"
          />
        </h1>
        <p className="text-indigo-200 mt-3 max-w-2xl mx-auto">
          Have a question, feedback, or just want to say hi? Fill out the form below and we’ll get back to you soon.
        </p>
      </div>

      <form
        data-aos="fade-up"
        className="max-w-3xl mx-auto bg-white text-gray-800 p-6 rounded-xl shadow-md space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Your Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Message</label>
          <textarea
            rows="5"
            placeholder="Write your message..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-all duration-200"
        >
          Send Message
        </button>
      </form>

      <div className="text-center text-sm text-indigo-200 mt-10">
        <p>📬 support@codecircle.com</p>
        <p className="mt-1">📍 Dhaka, Bangladesh</p>
      </div>
    </div>
  );
};

export default Contact;
