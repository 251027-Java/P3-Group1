import './App.css'
// App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IframeWrapper from './iframwrapper/IframeWrapper';
import GameIframe from './iframwrapper/GameIframe';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import GamesDashboard from './components/GamesDashboard';
import CommunityHub from './components/Community/CommunityHub';
import CommunityThreads from './components/Community/CommunityThreads';
import GameProfile from './components/GamePage/GameProfile';
import Cart from './components/Cart';
import { useState } from 'react';
import Wishlist from './components/Wishlist';
import RewardsPage from './components/RewardsPage';
import UploadGame from './components/UploadGame';
import UploadWebGame from './components/UploadGame';
import { CartProvider } from './contexts/CartContext';
import TokenStore from './components/TokenStore';
import LowTokenPrompt from './components/LowTokenPrompt';

function App() {
  
  // cart state moved to CartProvider
  
  return (
    <Router>
      <CartProvider>
        <Navbar onCartClick={() => {}} cartCount={0} />
      

    <div className='pt-[72px]'>
      <Cart />
      <LowTokenPrompt />
      <Routes>
        <Route path="/play-impossible" element={<GameIframe/>} />
        <Route path="/*" element={<IframeWrapper baseUrl="http://localhost:4200" />} />

        <Route 
          path="/profile" 
          element={<Profile/>} 
        />

        <Route 
          path="/GamesDashboard" 
          element={<GamesDashboard/>} 
        />

        <Route 
          path="/CommunityHub" 
          element={<CommunityHub/>} 
        />

        <Route 
          path="/CommunityThreads" 
          element={<CommunityThreads/>} 
        />

        <Route 
          path="/games/:id" 
          element={<GameProfile/>} 
        />

        {/* Inventory removed: games are free & available on Dashboard */}

        <Route 
          path="/Wishlist" 
          element={<Wishlist/>} 
        />

        <Route 
          path="/Rewards" 
          element={<RewardsPage/>} 
        />

        <Route
          path="/BuyTokens"
          element={<TokenStore />}
        />

        <Route 
          path="/UploadGame" 
          element={<UploadWebGame/>} 
        />


      </Routes>
    </div>
    </CartProvider>
    </Router>
  );
}

export default App
