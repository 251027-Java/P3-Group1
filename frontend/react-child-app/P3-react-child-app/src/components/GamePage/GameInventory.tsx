import React, { useState } from 'react';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const myGames = [
    { id: 1, title: "Neon Protocol", size: "12.4 GB", status: "Installed" },
    { id: 2, title: "Void Runner", size: "8.1 GB", status: "Update Available" },
    { id: 3, title: "Deep Space Hull", size: "22.0 GB", status: "Installed" },
    { id: 4, title: "Cyber-Engine 4", size: "4.5 GB", status: "Ready" },
    { id: 5, title: "Red Sector", size: "15.9 GB", status: "Installed" },
    { id: 6, title: "Synapse", size: "1.2 GB", status: "Ready" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* 1. System Header */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Command_Inventory</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <span className="w-2 h-2 bg-[#822C2C] rounded-full animate-pulse"></span>
              Disk Space: 420GB / 1TB
            </div>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search Library..."
            className="bg-[#151515] border border-white/10 px-4 py-2 rounded text-sm focus:border-[#822C2C] outline-none w-64 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="p-2 bg-[#151515] border border-white/10 rounded hover:text-[#822C2C]">
            <span className="text-xs font-bold uppercase">Filter</span>
          </button>
        </div>
      </header>

      {/* 2. Inventory Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {myGames.map((game) => (
          <div key={game.id} className="group relative flex flex-col cursor-pointer">
            {/* Poster Art (3:4 Ratio) */}
            <div className="aspect-[3/4] bg-[#151515] rounded-lg overflow-hidden border border-white/5 relative group-hover:border-[#822C2C] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#822C2C]/20 to-black/80" />
              
              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4">
                <button className="w-full py-3 bg-[#822C2C] hover:bg-[#a13737] text-xs font-black uppercase tracking-widest rounded-sm mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Launch Engine
                </button>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-sm transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                  Properties
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-bold uppercase tracking-tighter border border-white/10">
                {game.status}
              </div>
            </div>

            {/* Meta Data */}
            <div className="mt-3">
              <h3 className="text-sm font-bold truncate uppercase tracking-tight group-hover:text-[#822C2C] transition-colors">
                {game.title}
              </h3>
              <p className="text-[10px] text-gray-600 font-mono mt-0.5">{game.size}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Empty Slot Filler (Aesthetic) */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 opacity-20">
         <div className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl font-black text-white/5 italic">+</span>
         </div>
      </div>
    </div>
  );
};

export default Inventory;