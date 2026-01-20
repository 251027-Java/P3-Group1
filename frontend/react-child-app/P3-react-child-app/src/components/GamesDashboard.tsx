import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GamesDashboard = () => {
  const [activeTag, setActiveTag] = useState('All');
  const tags = ['Action', 'RPG', 'Strategy', 'Indie', 'Horror', 'Sci-Fi'];

  const navigate = useNavigate();

  const handleWishClick = () =>{
    navigate("/Wishlist")
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. Featured Games Carousel (Hero) */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
        
        {/* Mock Carousel Image/Slide */}
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-4xl">
          <span className="text-[#822C2C] font-black tracking-[0.3em] text-sm mb-2 uppercase">Featured & Recommended</span>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Cyber Protocol: Red</h1>
          <p className="text-gray-400 text-lg mb-8">Experience the next generation of tactical espionage in a world where data is the only currency that matters.</p>
          <div className="flex space-x-4">
            <button className="px-8 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded-sm transition-all shadow-lg shadow-red-900/40">INSTALL NOW</button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-sm transition-all border border-white/10"
            onClick={handleWishClick}>WISHLIST</button>
          </div>
        </div>
      </section>

      <div className="px-12 py-10 grid grid-cols-12 gap-8">
        
        {/* 2. Left Sidebar: Navigation & Filtering */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div>
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-widest mb-4">Search by Tag</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search games..." 
                className="w-full bg-[#151515] border border-white/5 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#822C2C] transition-all"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase border rounded-full transition-all ${
                    activeTag === tag ? 'bg-[#822C2C] border-[#822C2C]' : 'border-white/10 hover:border-white/30 text-gray-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <nav className="space-y-2">
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-widest mb-4">Browse</h3>
            {['Store Home', 'New Releases', 'Top Sellers', 'Special Offers'].map(link => (
              <a key={link} href="#" className="block py-2 text-sm text-gray-400 hover:text-white transition-colors">{link}</a>
            ))}
          </nav>
        </aside>

        {/* 3. Main Content: Game Grid & Community Hub */}
        <div className="col-span-12 lg:col-span-9 space-y-12">
          
          {/* Game Grid Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 border-b border-white/5 pb-2">Trending Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="group bg-[#151515] rounded-md overflow-hidden hover:ring-1 hover:ring-[#822C2C] transition-all">
                  <div className="aspect-video bg-gray-800 relative">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">SYSTEM_OVERRIDE_{i}</h4>
                      <p className="text-[10px] text-gray-500 uppercase">Action, Stealth</p>
                    </div>
                    <span className="text-xs font-mono text-[#822C2C]">$19.99</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Hub Preview */}
          <section className="bg-[#151515] rounded-xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight italic">Community Hub</h2>
              <button className="text-xs text-[#822C2C] font-bold uppercase border-b border-[#822C2C]">Visit All Hubs</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">Recent Discussion</p>
                <div className="bg-[#0a0a0a] p-4 rounded-lg border-l-4 border-[#822C2C]">
                  <p className="text-sm italic">"The latest patch really improved the frame rate on Linux!"</p>
                  <span className="text-[10px] text-gray-600">— 24 comments</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">Top Community Art</p>
                <div className="h-32 bg-[#0a0a0a] rounded-lg flex items-center justify-center border border-dashed border-white/10">
                  <span className="text-gray-700 font-black text-4xl">P3_ART</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default GamesDashboard;