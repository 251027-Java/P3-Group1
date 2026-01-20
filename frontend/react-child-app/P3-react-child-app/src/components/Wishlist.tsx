import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, title: "Neon Protocol", price: 24.99, discount: 20, status: "On Sale", dateAdded: "2 days ago" },
    { id: 2, title: "Void Runner", price: 15.00, discount: 0, status: "Coming Soon", dateAdded: "1 week ago" },
    { id: 3, title: "Deep Space Hull", price: 22.00, discount: 50, status: "On Sale", dateAdded: "3 days ago" },
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header Area */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Target_Manifest</h1>
          <p className="text-gray-500 text-sm font-mono mt-4 uppercase tracking-widest">
            Stored Interests: {wishlist.length} Items // Monitoring for Price Drops
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#822C2C] border-b border-transparent hover:border-[#822C2C] transition-all pb-1">
            Export List
          </button>
          <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#822C2C] border-b border-transparent hover:border-[#822C2C] transition-all pb-1">
            Privacy Settings
          </button>
        </div>
      </header>

      {/* Wishlist Items Stack */}
      <div className="max-w-6xl mx-auto space-y-4">
        {wishlist.map((item) => (
          <div key={item.id} className="group relative bg-[#151515] border border-white/5 rounded-xl overflow-hidden hover:border-[#822C2C]/50 transition-all flex items-center p-4 gap-6">
            
            {/* Game Thumbnail */}
            <div className="w-48 aspect-video bg-black rounded overflow-hidden flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#822C2C] to-black opacity-30" />
              {item.discount > 0 && (
                <div className="absolute top-2 left-2 bg-[#822C2C] text-white text-[10px] font-black px-2 py-1 rounded">
                  -{item.discount}%
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold uppercase tracking-tight truncate group-hover:text-[#822C2C] transition-colors">
                  {item.title}
                </h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  item.status === 'On Sale' ? 'border-green-500/50 text-green-500' : 'border-gray-700 text-gray-500'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-600">Added {item.dateAdded}</p>
            </div>

            {/* Price & Action Section */}
            <div className="flex items-center gap-8 pr-4">
              <div className="text-right">
                {item.discount > 0 && (
                  <p className="text-xs text-gray-600 line-through font-mono">
                    ${item.price.toFixed(2)}
                  </p>
                )}
                <p className="text-xl font-black font-mono">
                  ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button className="px-6 py-2 bg-[#822C2C] hover:bg-[#a13737] text-[10px] font-black uppercase tracking-widest rounded-sm transition-all whitespace-nowrap">
                  Add to Cart
                </button>
                <button className="text-[9px] font-bold text-gray-600 hover:text-white uppercase tracking-tighter text-center">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {wishlist.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-gray-600 italic">No targets acquired. Browse the store to populate your manifest.</p>
            <Link to="/GamesDashboard" className="mt-4 inline-block text-[#822C2C] font-bold uppercase text-xs hover:underline">
              Return to Hub
            </Link>
          </div>
        )}
      </div>

      {/* Recommendation Footer */}
      <footer className="max-w-6xl mx-auto mt-20 pt-10 border-t border-white/5">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 text-center">Recommended based on your interests</h2>
        <div className="grid grid-cols-4 gap-4 opacity-40 hover:opacity-100 transition-opacity">
           {[1,2,3,4].map(i => (
             <div key={i} className="aspect-video bg-[#151515] rounded-lg border border-white/10" />
           ))}
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;