import './App.css'
// App.tsx - Single-SPA compatible React MFE
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import GamesDashboard from './components/GamesDashboard';
import CommunityHub from './components/Community/CommunityHub';
import CommunityThreads from './components/Community/CommunityThreads';
import GameProfile from './components/GamePage/GameProfile';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import RewardsPage from './components/RewardsPage';
import UploadWebGame from './components/UploadGame';
import { CartProvider } from './contexts/CartContext';
import TokenStore from './components/TokenStore';
import LowTokenPrompt from './components/LowTokenPrompt';

function App() {
  // cart state moved to CartProvider

  return (
    <Router>
      <CartProvider>
        <Navbar onCartClick={() => { }} cartCount={0} />

        <div className='pt-[72px]'>
          <Cart />
          <LowTokenPrompt />
          <Routes>
            {/* Default route - Games Dashboard */}
            <Route path="/" element={<GamesDashboard />} />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/GamesDashboard"
              element={<GamesDashboard />}
            />

            <Route
              path="/CommunityHub"
              element={<CommunityHub />}
            />

            <Route
              path="/CommunityThreads"
              element={<CommunityThreads />}
            />

            <Route
              path="/games/:id"
              element={<GameProfile />}
            />

            <Route
              path="/Wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/Rewards"
              element={<RewardsPage />}
            />

            <Route
              path="/BuyTokens"
              element={<TokenStore />}
            />

            <Route
              path="/UploadGame"
              element={<UploadWebGame />}
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App
