const CommunityThreads = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <button className="text-[#822C2C] text-xs font-bold uppercase mb-6">← Back to Hub</button>
        
        {/* Original Post */}
        <div className="bg-[#151515] p-8 rounded-t-2xl border-x border-t border-white/5">
          <h1 className="text-3xl font-bold mb-4">Best shaders for low-end systems in Project_Delta?</h1>
          <div className="flex items-center space-x-4 mb-8">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" className="w-10 h-10 rounded-full" />
             <div>
               <p className="text-sm font-bold">Commander_Anna</p>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest">Post Author | 42 Posts</p>
             </div>
          </div>
          <div className="prose prose-invert max-w-none text-gray-300">
            <p>I've been experimenting with the new lighting engine and found that disabling SSAO gives a massive boost...</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-[#0a0a0a] border-x border-b border-white/5 rounded-b-2xl">
          <div className="p-8 space-y-8">
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-widest">38 Responses</h3>
            
            {/* Mock Comment */}
            {[1, 2].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="w-1 h-auto bg-gradient-to-b from-[#822C2C] to-transparent"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-1">User_Tech_Support_{i} <span className="text-gray-600 font-normal ml-2">22m ago</span></p>
                  <p className="text-sm text-gray-400">Great tip! Also try lowering the shadow resolution to 512px.</p>
                  <div className="mt-2 flex space-x-4 text-[10px] uppercase font-black text-gray-600">
                    <button className="hover:text-white">Reply</button>
                    <button className="hover:text-white">Award</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Reply Area */}
            <div className="mt-12 bg-[#151515] p-6 rounded-xl border border-[#822C2C]/30">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-700 h-24 resize-none"
                placeholder="Write your response..."
              ></textarea>
              <div className="flex justify-end mt-4">
                <button className="px-6 py-2 bg-[#822C2C] text-white font-bold text-xs uppercase rounded-sm">Post Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityThreads;