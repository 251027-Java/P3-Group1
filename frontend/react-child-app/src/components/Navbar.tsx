import { Link } from "react-router-dom";
import { useCart } from '../contexts/CartContext';

// Pass props to control the cart state from App.tsx
interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
}

function Navbar({ onCartClick: _onCartClick, cartCount: _cartCount }: NavbarProps) {
  const { cartItems, openCart } = useCart();
  const count = cartItems.length;

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 text-white shadow-lg"
      style={{ backgroundColor: '#822C2C' }}
    >
      {/* Far Left: Title */}
      <Link to="/GamesDashboard" className="text-2xl font-bold tracking-wider uppercase hover:opacity-90">
        P3 FLEET
      </Link>

      {/* Right Side: Nav + Cart + PFP */}
      <div className="flex items-center space-x-10">
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 font-medium italic">
          <Link to="/GamesDashboard" className="hover:opacity-75 transition-opacity">Dashboard</Link>
          <Link to="/CommunityHub" className="hover:opacity-75 transition-opacity">Community</Link>
          <Link to="/Rewards" className="hover:opacity-75 transition-opacity">Rewards</Link>
          <Link to="/UploadGame" className="hover:opacity-75 transition-opacity">Upload Game</Link>
        </div>

        <div className="flex items-center space-x-6 border-l border-white/20 pl-8">
          {/* 1. Cart Trigger */}
          <button
            onClick={() => openCart()}
            className="relative p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#822C2C] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                {count}
              </span>
            )}
          </button>

          {/* 2. User Profile Link */}
          <Link to="/profile" className="flex items-center space-x-4 group">
            <span className="text-sm font-light group-hover:text-gray-300 transition-colors">Admin User</span>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User Profile"
              className="w-10 h-10 rounded-full bg-white/10 p-0.5 border border-white/30 cursor-pointer shadow-sm group-hover:border-white transition-all"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;