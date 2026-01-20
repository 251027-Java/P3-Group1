import React, { useState } from 'react';

const GameProfile = () => {
  const [activeTab, setActiveTab] = useState('About');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. HERO HEADER SECTION */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Dynamic Background Blur */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070')] bg-cover bg-center scale-110 blur-xl opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Game Cover Art */}
            <div className="w-64 h-96 bg-[#151515] rounded-lg shadow-2xl shadow-black border border-white/10 overflow-hidden flex-shrink-0">
               <div className="w-full h-full bg-gradient-to-br from-[#822C2C] to-black flex items-center justify-center p-6 text-center">
                  <span className="text-4xl font-black italic tracking-tighter uppercase">Cyber<br/>Protocol</span>
               </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-[#822C2C] text-[10px] font-bold uppercase rounded">Top Rated</span>
                <span className="text-gray-400 text-xs uppercase tracking-widest">Released: Jan 2026</span>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 italic">Cyber Protocol: Red</h1>
              <div className="flex gap-2 mb-6">
                {['Cyberpunk', 'Tactical', 'Indie', 'Stealth'].map(t => (
                  <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold text-gray-400">{t}</span>
                ))}
              </div>
              
              {/* Action Bar */}
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md w-fit">
                <div className="pr-4 border-r border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Price</p>
                  <p className="text-xl font-mono text-[#822C2C]">$24.99</p>
                </div>
                <button className="px-8 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded text-sm transition-all uppercase tracking-widest shadow-lg shadow-red-900/40">
                  Add to Cart
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded border border-white/10">
                  ❤️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENT TABS & BODY */}
      <div className="container mx-auto px-8 py-12 grid grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8">
          <nav className="flex gap-8 border-b border-white/10 mb-8">
            {['About', 'System Requirements', 'Updates', 'Reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'border-b-2 border-[#822C2C] text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-[#822C2C] uppercase italic">The Mission</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              In a world where the lines between biological and digital are blurred, you play as a 
              "Protocol Red" agent—a high-stakes data retrieval specialist. 
              Navigate through neo-Tokyo's hyper-dense infrastructure using an advanced 
              hacker-based stealth system.
            </p>
            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="aspect-video bg-[#151515] rounded border border-white/5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-black to-[#822C2C33]" />
              </div>
              <div className="aspect-video bg-[#151515] rounded border border-white/5 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tl from-black to-[#822C2C33]" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. SIDEBAR INFO */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Review Stats */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">User Ratings</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-[#822C2C]">94%</span>
              <span className="text-xs text-gray-400 mb-1">Overwhelmingly Positive</span>
            </div>
            <div className="mt-4 w-full h-1 bg-gray-800 rounded-full">
              <div className="w-[94%] h-full bg-[#822C2C]" />
            </div>
          </section>

          {/* Developer Details */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Developer</p>
              <p className="text-sm font-bold text-[#822C2C] hover:underline cursor-pointer">P3_FLEET_STUDIOS</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Publisher</p>
              <p className="text-sm font-bold">Apkudo Games</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Franchise</p>
              <p className="text-sm font-bold italic">Cyber Protocol Series</p>
            </div>
          </section>

          {/* Languages */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Languages Supported</h4>
            <div className="text-xs text-gray-400 space-y-2">
              <p>English, Japanese, French, German, Spanish</p>
              <p className="text-[10px] italic">Full Audio: English, Japanese</p>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
};

export default GameProfile;