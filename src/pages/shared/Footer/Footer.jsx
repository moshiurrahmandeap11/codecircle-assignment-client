import React from "react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="relative mt-16 overflow-hidden"
      data-aos="fade-up"
    >
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/70 to-slate-800/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Main glass container */}
      <div className="relative bg-white/5 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Left Section - Logo + Description */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                CodeCircle
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                A creative space for devs to share, learn, and grow together. Join the circle, write your code, and spark your ideas 
                <span className="inline-block ml-2 text-xl animate-pulse">💡</span>
              </p>
              
              {/* Stats */}
              <div className="mt-6 flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">10K+</div>
                  <div className="text-xs text-white/60">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-400">50K+</div>
                  <div className="text-xs text-white/60">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">24/7</div>
                  <div className="text-xs text-white/60">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <h3 className="font-bold text-xl text-white/95 mb-6 flex items-center gap-2">
                <span className="text-purple-400">🔗</span>
                Quick Links
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "Membership", href: "/membership" },
                  { name: "Contact", href: "/contact" }
                ].map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white bg-white/0 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:translate-x-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Social Links */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <h3 className="font-bold text-xl text-white/95 mb-6 flex items-center gap-2">
                <span className="text-pink-400">🌐</span>
                Connect with us
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FaFacebook, href: "https://facebook.com", color: "hover:text-blue-400", bg: "hover:bg-blue-500/20", name: "Facebook" },
                  { icon: FaGithub, href: "https://github.com", color: "hover:text-gray-300", bg: "hover:bg-gray-500/20", name: "GitHub" },
                  { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-sky-400", bg: "hover:bg-sky-500/20", name: "Twitter" },
                  { icon: FaLinkedin, href: "https://linkedin.com", color: "hover:text-blue-300", bg: "hover:bg-blue-600/20", name: "LinkedIn" }
                ].map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center gap-3 p-3 text-white/80 ${social.color} ${social.bg} bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <social.icon className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>

              {/* Newsletter signup */}
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                  <span>📧</span>
                  Stay Updated
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/40 transition-all duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with enhanced styling */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="text-center md:text-left">
                <p className="text-white/70 text-sm">
                  © {new Date().getFullYear()} CodeCircle. All rights reserved.
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Made with <span className="text-red-400 animate-pulse">❤️</span> for the developer community
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs text-white/60">
                <a href="/privacy" className="hover:text-white/90 transition-colors duration-300">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-white/90 transition-colors duration-300">Terms of Service</a>
                <span>•</span>
                <a href="/cookies" className="hover:text-white/90 transition-colors duration-300">Cookies</a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decoration elements */}
        <div className="absolute top-8 left-8 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse blur-sm" />
        <div className="absolute top-16 right-16 w-2 h-2 bg-pink-400/30 rounded-full animate-ping blur-sm" />
        <div className="absolute bottom-16 left-16 w-4 h-4 bg-blue-400/15 rounded-full animate-pulse blur-sm" />
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-purple-300/25 rounded-full animate-ping blur-sm" />
      </div>
    </footer>
  );
};

export default Footer;