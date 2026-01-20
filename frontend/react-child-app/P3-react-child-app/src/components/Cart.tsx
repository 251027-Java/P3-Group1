import React from 'react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

const Cart = ({ isOpen, onClose, items }: CartProps) => {
  // Mock calculation
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    // In a real app, you'd call your backend to create a Stripe Session
    // const response = await fetch('/api/create-checkout-session', { method: 'POST' });
    // const session = await response.json();
    // window.location.href = session.url;
    
    console.log("Redirecting to Stripe...");
    alert("Redirecting to Stripe Secure Checkout...");
  };

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/10 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-tighter italic">Your Manifest</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <p className="italic">Your manifest is empty.</p>
              </div>
            ) : (
              items.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded border border-white/5 flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#822C2C] to-black opacity-50" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase group-hover:text-[#822C2C] transition-colors">{item.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">DIGITAL LICENSE</p>
                    <p className="mt-2 text-[#822C2C] font-mono text-sm">${item.price}</p>
                  </div>
                  <button className="text-gray-700 hover:text-red-500 text-xs">Remove</button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          <div className="p-6 bg-[#151515] border-t border-white/10">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-gray-500 text-sm">Tax</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div className="flex justify-between mb-8 pt-4 border-t border-white/5">
              <span className="font-black uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black text-[#822C2C] font-mono">${subtotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full py-4 bg-[#822C2C] hover:bg-[#a13737] disabled:bg-gray-800 disabled:text-gray-600 font-bold uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg shadow-red-900/20"
            >
              Initialize Stripe Checkout
            </button>
            <div className="mt-4 flex justify-center space-x-4 opacity-30 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;