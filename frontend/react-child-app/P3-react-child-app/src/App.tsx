import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IframeWrapper from './iframwrapper/IframeWrapper';
import GameIframeWrapper from './components/GameIframeWrapper';
import GameIframe from './iframwrapper/GameIframe';
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
  return (
    <Router>
      <CartProvider>
        <Navbar onCartClick={() => { }} cartCount={0} />

        <div className='pt-[72px]'>
          <Cart />
          <LowTokenPrompt />

          <Routes>
            {/* New Features */}
            <Route path="/play-impossible" element={<GameIframe />} />
            <Route path="/games/bubble-trouble" element={<GameIframeWrapper game="bubble-trouble" />} />
            <Route path="/games/flappy-bird" element={<GameIframeWrapper game="flappy-bird" />} />

            {/* Core Pages */}
            <Route path="/" element={<GamesDashboard />} />
            <Route path="/GamesDashboard" element={<GamesDashboard />} />
            <Route path="/CommunityHub" element={<CommunityHub />} />
            <Route path="/CommunityThreads" element={<CommunityThreads />} />

            {/* Profile & Game Details */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/games/:id" element={<GameProfile />} />
            <Route path="/GameProfile" element={<GameProfile />} />

            {/* Store & Rewards */}
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/Rewards" element={<RewardsPage />} />
            <Route path="/BuyTokens" element={<TokenStore />} />
            <Route path="/UploadGame" element={<UploadWebGame />} />

            {/* Default Catch-all (Angular Fallback) */}
            <Route path="/*" element={<IframeWrapper baseUrl="http://localhost:4200" />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
