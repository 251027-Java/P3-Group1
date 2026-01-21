import React, { useEffect, useState } from 'react';
import { userAPI } from '../utils/userApi';
import { useNavigate } from 'react-router-dom';

const packages = [
  { id: 'p100', tokens: 100, label: 'Add 100 Tokens' },
  { id: 'p250', tokens: 250, label: 'Add 250 Tokens' },
  { id: 'p500', tokens: 500, label: 'Add 500 Tokens' },
  { id: 'p1000', tokens: 1000, label: 'Add 1000 Tokens' },
];

const TokenStore: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const refreshBalance = async () => {
    const user = userAPI.currentUser as any;
    if (!user || !user.id) return setBalance(null);
    try {
      const bal = await userAPI.getBalance(user.id);
      setBalance(bal as number);
    } catch (e) {
      console.error('Failed fetching balance', e);
      setBalance(null);
    }
  };

  useEffect(() => { refreshBalance(); }, []);

  const handleAddTokens = async (pkg: any) => {
    const user = userAPI.currentUser as any;
    if (!user || !user.id) {
      alert('Please sign in to add tokens.');
      navigate('/profile');
      return;
    }

    setLoading(true);
    try {
      await userAPI.createTransaction(user.id, pkg.tokens, `DEMO_ADD:${pkg.id}`);
      await refreshBalance();
      alert(`${pkg.tokens} tokens added to your account.`);
    } catch (err) {
      console.error('Failed to add tokens', err);
      alert('Failed to add tokens.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Token Store — Demo</h1>
        <p className="text-sm text-gray-400 mb-6">This demo directly adds tokens to your account for testing. No payment required.</p>

        <div className="mb-6">
          <span className="text-xs text-gray-400">Your balance:</span>
          <div className="text-2xl font-bold">{balance !== null ? balance : '—'}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-[#151515] p-6 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{pkg.label}</h3>
                <p className="text-gray-400 text-sm">Instantly credit {pkg.tokens} tokens to your account.</p>
              </div>
              <div>
                <button disabled={loading} onClick={() => handleAddTokens(pkg)} className="px-4 py-2 bg-[#822C2C] rounded">{loading ? 'Working...' : 'Add'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenStore;
