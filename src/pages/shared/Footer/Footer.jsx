import React from "react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-tr from-indigo-800 to-purple-900 text-white mt-12"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section - Logo + Desc */}
        <div>
          <h2 className="text-2xl font-bold mb-2 tracking-wide">CodeCircle</h2>
          <p className="text-sm text-gray-300">
            A creative space for devs to share, learn, and grow together. Join the circle, write your code, and spark your ideas 💡
          </p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <a href="/" className="hover:text-gray-300 transition">Home</a>
          <a href="/forum" className="hover:text-gray-300 transition">Forum</a>
          <a href="/resources" className="hover:text-gray-300 transition">Resources</a>
          <a href="/membership" className="hover:text-gray-300 transition">Membership</a>
          <a href="/contact" className="hover:text-gray-300 transition">Contact</a>
        </div>

        {/* Right Section - Socials */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Connect with us</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-300">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-indigo-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} CodeCircle. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
