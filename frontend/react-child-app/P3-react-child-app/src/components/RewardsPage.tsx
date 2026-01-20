import React, { useState } from 'react';

const RewardsPage = () => {
  const [userBalance, setUserBalance] = useState(2500);

  // This would come from your 'reward_items' table
  const storeItems = [
    { id: 101, title: "Premium Profile Glow", cost: 1200, icon: "✨", desc: "A pulsing red aura for your avatar." },
    { id: 102, title: "Expansion Pass: Zero", cost: 5000, icon: "💾", desc: "Unlock all DLC for the Zero franchise." },
  ];

  // This would come from your 'coin_transactions' table
  const history = [
    { id: 1, type: 'EARNED', amount: 500, source: 'Purchase: Cyber Protocol', date: '2026-01-15' },
    { id: 2, type: 'SPENT', amount: -200, source: 'Redeemed: Avatar Icon', date: '2026-01-12' },
    { id: 3, type: 'EARNED', amount: 50, source: 'Community Contribution', date: '2026-01-10' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: The Store (The "Catalog" Table) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Coin_Exchange</h1>
            <div className="bg-[#822C2C] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/20">
              <span className="text-sm font-bold">🪙 {userBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeItems.map((item) => (
              <div key={item.id} className="bg-[#151515] border border-white/5 p-6 rounded-2xl hover:border-[#822C2C]/50 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                <h3 className="text-lg font-bold uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6">{item.desc}</p>
                
                <button 
                  disabled={userBalance < item.cost}
                  className="w-full py-3 bg-[#151515] border border-[#822C2C] text-[#822C2C] hover:bg-[#822C2C] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent font-black uppercase text-xs tracking-widest transition-all rounded-lg"
                >
                  Exchange {item.cost}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Transaction Ledger (The "Transaction" Table) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#151515] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Transaction_Ledger</h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {history.map((trx) => (
                <div key={trx.id} className="p-4 flex justify-between items-center hover:bg-white/[0.02]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tight">{trx.source}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-1">{trx.date}</p>
                  </div>
                  <span className={`font-mono font-bold text-sm ${trx.type === 'EARNED' ? 'text-green-500' : 'text-[#822C2C]'}`}>
                    {trx.type === 'EARNED' ? '+' : ''}{trx.amount}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 text-[10px] font-bold text-gray-500 uppercase hover:text-white transition-colors bg-black/20">
              Download Full Statement (CSV)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RewardsPage;