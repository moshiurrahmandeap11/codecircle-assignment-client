import React from "react";

const About = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-6 py-16">
      {/* Overlay gradient glass effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-cyan-500/10 opacity-30 blur-3xl"></div>

      <div className="relative z-10 max-w-4xl w-full text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
          About CodeCircle
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          CodeCircle is more than just a community – it’s a movement.  
          We connect developers, learners, and creators in one place where 
          knowledge flows, ideas spark, and innovations thrive.  
          Whether you’re building your first project or scaling your vision, 
          CodeCircle empowers you with resources, mentorship, and 
          opportunities to grow.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="px-6 py-4 rounded-xl bg-white/10 border border-white/10 shadow-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-semibold">🌐 Community</h3>
            <p className="text-sm text-gray-400">A global hub for devs & creators</p>
          </div>
          <div className="px-6 py-4 rounded-xl bg-white/10 border border-white/10 shadow-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-semibold">⚡ Innovation</h3>
            <p className="text-sm text-gray-400">Learn, build, and inspire together</p>
          </div>
          <div className="px-6 py-4 rounded-xl bg-white/10 border border-white/10 shadow-lg hover:bg-white/20 transition">
            <h3 className="text-xl font-semibold">🤝 Collaboration</h3>
            <p className="text-sm text-gray-400">Grow with mentorship & teamwork</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
