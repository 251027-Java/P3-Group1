import { useState } from "react";

const Profile = () => {
  return (

    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header / Profile Info */}
      <header className="flex items-center justify-between mb-10 bg-gradient-to-r from-[#151515] to-transparent p-6 rounded-2xl border-l-4 border-[#822C2C]">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-20 h-20 rounded-xl border-2 border-white/10" alt="pfp" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Admin_Commander</h1>
            <p className="text-gray-500 font-mono text-sm">LVL 42 | ELITE CREATOR</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-[#822C2C] hover:bg-[#a13737] rounded-full text-xs font-bold uppercase transition-all">
          Edit Profile
        </button>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Games Library (Main Content) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#822C2C]">Games Library</h2>
              <span className="text-xs text-gray-500">24 Total</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden relative group cursor-pointer border border-white/5 hover:border-[#822C2C] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-xs font-bold uppercase">Project_Delta_{i}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#822C2C] mb-6">Community Posts</h2>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-[#0a0a0a] p-4 rounded-xl border-l-2 border-gray-800">
                  <p className="text-sm text-gray-300">"Just uploaded the new assets for the P3 Engine. Feedback welcome!"</p>
                  <div className="mt-2 flex space-x-4 text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>2 hours ago</span>
                    <span className="text-[#822C2C]">12 Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Friends, Notifications & Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Notifications */}
          <section className="bg-[#822C2C]/10 border border-[#822C2C]/20 p-6 rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="text-xs flex items-center justify-between bg-black/20 p-3 rounded-lg">
                <span>New friend request from <b>Neon_Rebel</b></span>
                <span className="w-2 h-2 bg-[#822C2C] rounded-full"></span>
              </div>
            </div>
          </section>

          {/* Friends List */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Friends</h2>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-10 h-10 rounded-full border-2 border-[#151515] hover:z-10 cursor-pointer" />
              ))}
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#151515] flex items-center justify-center text-[10px] text-gray-400">+12</div>
            </div>
          </section>

          {/* Settings / Quick Actions */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Settings</h2>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all">Account</button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all">Privacy</button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all">Security</button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all">Billing</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;