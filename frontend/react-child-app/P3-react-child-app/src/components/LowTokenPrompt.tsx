import React, { useEffect, useState } from 'react';
import { userAPI } from '../utils/userApi';
import { Link } from 'react-router-dom';

const THRESHOLD = 10; // tokens

const LowTokenPrompt = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const check = async () => {
    const user: any = userAPI.currentUser;
    if (!user || !user.id) return;
    try {
      const b = await userAPI.getBalance(user.id);
      setBalance(b);
      setVisible(b <= THRESHOLD);
    } catch (e) {
      console.error('Balance check failed', e);
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#151515] border border-white/10 p-4 rounded-xl shadow-lg z-50">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm">Low Tokens — you have <strong>{balance}</strong> tokens.</p>
          <Link to="/BuyTokens" className="text-xs text-[#822C2C] hover:underline">Buy more tokens</Link>
        </div>
        <button onClick={() => setVisible(false)} className="text-gray-400">✕</button>
      </div>
    </div>
  );
};

export default LowTokenPrompt;
