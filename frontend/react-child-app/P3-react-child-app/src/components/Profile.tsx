import { useState, useEffect } from "react";
import { getUserById, getUserGamesLibrary, getUserStatistics, getUserFriends } from "../api/userProfile";
import type { Game, User } from "../types";
import type { UserStatistics } from "../api/userProfile";
import SettingsModal from "./SettingsModal";

// Using user ID 2 (Alpha_Tester) from the seeded data
const USER_ID = 2;

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch user data, games library, friends, and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user data first
        const userData = await getUserById(USER_ID);
        setUser(userData);
        
        // Then fetch related data
        const [gamesData, friendsData, statsData] = await Promise.all([
          getUserGamesLibrary(USER_ID),
          getUserFriends(USER_ID),
          getUserStatistics(USER_ID),
        ]);
        
        setGames(gamesData);
        setFriends(friendsData);
        setStats(statsData);
        
        console.log("✅ User loaded:", userData);
        console.log("✅ Friends loaded:", friendsData);
        console.log("✅ Games loaded:", gamesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile data");
        console.error("❌ Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#822C2C] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const levelDisplay = stats?.level || user.level;

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUserUpdate={handleUserUpdate}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        {/* Header / Profile Info */}
        <header className="flex items-center justify-between mb-10 bg-gradient-to-r from-[#151515] to-transparent p-6 rounded-2xl border-l-4 border-[#822C2C]">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={user.displayImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                className="w-20 h-20 rounded-xl border-2 border-white/10" 
                alt="Profile" 
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">{user.displayName}</h1>
              <p className="text-gray-500 font-mono text-sm">
                {levelDisplay} {user.canSell && "| SELLER"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="px-6 py-2 bg-[#822C2C] hover:bg-[#a13737] rounded-full text-xs font-bold uppercase transition-all"
          >
            Edit Profile
          </button>
        </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Games Library (Main Content) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#822C2C]">Games Library</h2>
              <span className="text-xs text-gray-500">{stats?.totalGames || games.length} Total</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#822C2C]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No games in your library yet</p>
                <a href="/games" className="mt-4 inline-block px-6 py-2 bg-[#822C2C] hover:bg-[#a13737] rounded-full text-xs font-bold uppercase transition-all">
                  Browse Games
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {games.slice(0, 6).map((game) => (
                  <div 
                    key={game.id} 
                    className="aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden relative group cursor-pointer border border-white/5 hover:border-[#822C2C] transition-all"
                  >
                    {game.backgroundImage ? (
                      <img 
                        src={game.backgroundImage} 
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#822C2C]/20 to-[#0a0a0a]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs font-bold uppercase truncate">{game.name}</p>
                      {game.price > 0 && (
                        <p className="text-[10px] text-gray-400">${game.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#822C2C] mb-6">Community Posts</h2>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-[#0a0a0a] p-4 rounded-xl border-l-2 border-gray-800">
                  <p className="text-sm text-gray-300">"Just uploaded the new assets for the P3 Engine. Feedback welcome!"</p>
                  <div className="mt-2 flex space-x-4 text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>2 hours ago</span>
                    <span className="text-[#822C2C]">12 Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Friends, Notifications & Settings */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Notifications */}
          <section className="bg-[#822C2C]/10 border border-[#822C2C]/20 p-6 rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Notifications</h2>
            <div className="space-y-3">
              <div className="text-xs flex items-center justify-between bg-black/20 p-3 rounded-lg">
                <span>New friend request from <b>Neon_Rebel</b></span>
                <span className="w-2 h-2 bg-[#822C2C] rounded-full"></span>
              </div>
            </div>
          </section>

          {/* Friends List */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
              Friends {stats && `(${stats.totalFriends})`}
            </h2>
            {friends.length === 0 ? (
              <p className="text-xs text-gray-500">No friends yet</p>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <img 
                      src={friend.displayImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.displayName}`} 
                      alt={friend.displayName}
                      className="w-10 h-10 rounded-full border-2 border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{friend.displayName}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{friend.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Settings / Quick Actions */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Settings</h2>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Account
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Privacy
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Security
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                Billing
              </button>
            </div>
          </section>

        </div>
        </div>
      </div>
    </>
  );
};

export default Profile;