import React from 'react';

const CommunityHub = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Community Hero Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic italic">Community Hub</h1>
          <p className="text-gray-500 mt-2">Shared content and discussions from the P3 Fleet.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Screenshots', 'Artwork', 'Broadcasts', 'Videos', 'News'].map(tab => (
            <button key={tab} className="px-4 py-2 bg-[#151515] hover:bg-[#822C2C] text-xs font-bold uppercase transition-all rounded-sm">
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Post Type: Discussion */}
          <div className="bg-[#151515] border border-white/5 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" className="w-8 h-8 rounded-full bg-[#822C2C]" />
                <span className="text-sm font-bold text-[#822C2C]">Commander_Anna</span>
                <span className="text-xs text-gray-600 uppercase">1 hour ago</span>
              </div>
              <h2 className="text-xl font-bold mb-3 hover:text-[#822C2C] cursor-pointer">Best shaders for low-end systems in Project_Delta?</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">I've been experimenting with the new lighting engine and found that disabling SSAO gives a massive boost without losing too much detail...</p>
              <div className="flex items-center space-x-6 text-xs font-bold text-gray-500">
                <button className="flex items-center space-x-2 hover:text-white"><span>▲</span> <span>142</span></button>
                <button className="flex items-center space-x-2 hover:text-white"><span>💬</span> <span>38 Comments</span></button>
                <button className="flex items-center space-x-2 hover:text-white"><span>⚑</span> <span>Report</span></button>
              </div>
            </div>
          </div>

          {/* Post Type: Media/Artwork */}
          <div className="bg-[#151515] border border-white/5 rounded-lg overflow-hidden">
            <div className="aspect-video bg-[#000] flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#822C2C55] to-transparent opacity-40"></div>
              <span className="text-6xl font-black text-white/10 group-hover:scale-110 transition-transform">SCREENSHOT_01</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 italic">User Artwork: "Red Skies"</span>
              <button className="text-[#822C2C] text-xs font-black">VIEW FULL SIZE</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-[#822C2C] p-6 rounded-lg shadow-lg shadow-red-900/20">
            <h3 className="font-black uppercase tracking-tighter text-xl mb-2">Create Post</h3>
            <p className="text-sm text-red-100/70 mb-4">Share your progress or start a discussion with the fleet.</p>
            <button className="w-full py-3 bg-black text-white font-bold rounded-sm hover:bg-white hover:text-black transition-all">NEW TOPIC</button>
          </div>

          <div className="bg-[#151515] p-6 rounded-lg border border-white/5">
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-[0.2em] mb-4">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#Devlog', '#BugReport', '#Showcase', '#P3Engine', '#Modding'].map(tag => (
                <span key={tag} className="text-[10px] bg-black px-2 py-1 rounded border border-white/10 hover:border-[#822C2C] cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityHub;