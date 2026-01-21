// TokenStore component
import { useCart } from '../contexts/CartContext';
import { userAPI } from '../utils/userApi';
import { useNavigate } from 'react-router-dom';

const packages = [
  { id: 'p100', tokens: 100, price: 12.99 },
  { id: 'p250', tokens: 250, price: 20.99 },
  { id: 'p500', tokens: 500, price: 32.99 },
  { id: 'p1000', tokens: 1000, price: 49.99 },
];

const TokenStore = () => {
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (pkg: any) => {
    addToCart({ title: `${pkg.tokens} Tokens Pack`, price: pkg.price, tokens: pkg.tokens });
    openCart();
  };

  const handleBuyNow = async (pkg: any) => {
    const user = userAPI.currentUser as any;
    if (!user || !user.id) {
      alert('Please sign in to purchase tokens.');
      navigate('/profile');
      return;
    }

    try {
      // Simulate successful payment by immediately crediting tokens
      const res = await userAPI.createTransaction(user.id, pkg.tokens, `PURCHASE_TOKENS:${pkg.id}`);
      alert(`Purchase successful — new balance: ${res.balance}`);
    } catch (e) {
      console.error(e);
      alert('Purchase failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Token Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-[#151515] p-6 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold">{pkg.tokens} Tokens</h3>
              <p className="text-gray-400 mt-2">Price: ${pkg.price.toFixed(2)}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => handleAddToCart(pkg)} className="px-4 py-2 bg-[#822C2C] rounded">Add to Cart</button>
                <button onClick={() => handleBuyNow(pkg)} className="px-4 py-2 bg-white/10 rounded">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenStore;
