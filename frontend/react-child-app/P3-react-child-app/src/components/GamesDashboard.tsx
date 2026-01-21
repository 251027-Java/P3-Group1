import React, { useState } from 'react';
import type { CommunityPost } from './Community/CommunityPost';
import { useNavigate } from 'react-router-dom';
import type { Game } from './GamePage/Game';

// Generated with assistance from GPT-4.1
// Reviewed and modified by Brody Roche
const GamesDashboard = () => {
  const [activeTag, setActiveTag] = useState('All');
  const [recentPost, setRecentPost] = useState<CommunityPost | null>(null);
  const [recentImagePost, setRecentImagePost] = useState<CommunityPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const tags = ['All', 'Action', 'RPG', 'Strategy', 'Indie', 'Horror', 'Sci-Fi'];
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    // 1. Fetch Games with Error Handling
    fetch('http://localhost:8082/api/games')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Ensure data is an array before setting state to avoid .reduce() crash
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.error("API did not return an array of games:", data);
          setGames([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch games:", err);
        setGames([]); // Fallback to empty array
      });

    // 2. Fetch Community Posts
    fetch('http://localhost:8080/api/community/posts')
      .then(res => {
        if (!res.ok) throw new Error('Community API error');
        return res.json();
      })
      .then(posts => {
        // Logic for sorting and setting posts remains similar but wrapped in array check
        if (Array.isArray(posts) && posts.length > 0) {
          const sorted = [...posts].sort((a, b) => { // Use spread to avoid mutating original if needed
            if (a.dateCreated && b.dateCreated) {
              return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
            }
            return (b.id || 0) - (a.id || 0);
          });

          setRecentPost(sorted[0]);

          const imagePosts = sorted.filter(post =>
            post.type === 'IMAGE' &&
            Array.isArray(post.attachments) &&
            post.attachments.length > 0
          );

          setRecentImagePost(imagePosts.length > 0 ? imagePosts[0] : null);
        }
      })
      .catch(err => console.error('Failed to fetch recent post:', err));
  }, []);

  const handleWishClick = () => {
    navigate("/Wishlist");
  };

  const handleGameClick = (id: number | string) => {
    // Find the game name to check for specific routing
    const game = games.find(g => g.id === id);
    if (game?.name === 'Bubble Trouble') {
      navigate('/games/bubble-trouble');
    } else if (game?.name === 'Flappy Bird') {
      navigate('/games/flappy-bird');
    } else if (game?.name === 'The Impossible - Mini Clone') { // Matching GameIframe name
      navigate('/play-impossible');
    } else {
      navigate(`/games/${id}`);
    }
  };

  // Efficient fuzzy search function
  const filterGames = () => {
    let filtered: Game[] = games;
    if (activeTag !== 'All') {
      filtered = filtered.filter((game: Game) => Array.isArray(game.tags) && game.tags.includes(activeTag));
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((game: Game) => {
        const titleMatch = typeof game.name === 'string' && game.name.toLowerCase().includes(term);
        const tagsMatch = Array.isArray(game.tags) && game.tags.some((tag: string) => typeof tag === 'string' && tag.toLowerCase().includes(term));
        return titleMatch || tagsMatch;
      });
    }
    return filtered;
  };

  const gamesToShow = filterGames();

  // Find the highest-rated game
  const featuredGame = React.useMemo(() => {
    if (!games || games.length === 0) return null;
    return games.reduce((max: Game, game: Game) => {
      return (typeof game.rating === 'number' && typeof max.rating === 'number' && game.rating > max.rating) ? game : max;
    }, games[0]);
  }, [games]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. Featured Games Carousel (Hero) */}
      <section className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-4xl">
          <span className="text-[#822C2C] font-black tracking-[0.3em] text-sm mb-2 uppercase">Featured & Recommended</span>
          {featuredGame ? (
            <>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">{featuredGame.name}</h1>
              <p className="text-gray-400 text-lg mb-8">{featuredGame.description || 'No description available.'}</p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Loading...</h1>
              <p className="text-gray-400 text-lg mb-8">Please wait while we load the featured game.</p>
            </>
          )}
          <div className="flex space-x-4">
            <button
              onClick={() => featuredGame && handleGameClick(featuredGame.id)}
              className="px-8 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded-sm transition-all shadow-lg shadow-red-900/40">
              VIEW GAME
            </button>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 font-bold rounded-sm transition-all border border-white/10"
              onClick={handleWishClick}>WISHLIST</button>
          </div>
        </div>
      </section>

      <div className="px-12 py-10 grid grid-cols-12 gap-8">

        {/* 2. Left Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          <div>
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-widest mb-4">Search by Tag</h3>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151515] border border-white/5 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#822C2C] transition-all"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase border rounded-full transition-all ${activeTag === tag ? 'bg-[#822C2C] border-[#822C2C]' : 'border-white/10 hover:border-white/30 text-gray-500'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-12">
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 border-b border-white/5 pb-2">Trending Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Demo tile for The Impossible game */}
                <div onClick={() => navigate('/play-impossible')} className="group bg-[#0b0b0b] rounded-md overflow-hidden hover:ring-1 hover:ring-[#22c55e] transition-all cursor-pointer border border-white/5">
                  <div className="aspect-square bg-gray-800 relative flex items-center justify-center">
                    <div style={{ width: 40, height: 40, background: '#4ade80' }} />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">The Impossible — Demo</h4>
                      <p className="text-[10px] text-gray-500 uppercase">Click to Play</p>
                    </div>
                    <span className="text-xs font-mono text-[#22c55e]">Demo</span>
                  </div>
                </div>
              {gamesToShow.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-12">No games found.</div>
              ) : (
                gamesToShow.map(game => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="group bg-[#151515] rounded-md overflow-hidden hover:ring-1 hover:ring-[#822C2C] transition-all cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm">{game.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase">{game.tags?.join(', ') || 'General'}</p>
                      </div>
                      {/* FIXED HERE: Added ?. and || 0 */}
                      <span className="text-xs font-mono text-[#822C2C]">${(game.price || 0).toFixed(2)}</span>
                    </div>
                    <div className="px-4 pb-4">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Play: 10 tokens</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Community Hub Preview */}
          <section className="bg-[#151515] rounded-xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight italic">Community Hub</h2>
              <button className="text-xs text-[#822C2C] font-bold uppercase border-b border-[#822C2C]">Visit All Hubs</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">Recent Discussion</p>
                <div className="bg-[#0a0a0a] p-4 rounded-lg border-l-4 border-[#822C2C]">
                  {recentPost ? (
                    <>
                      <p className="text-sm italic">{recentPost.title ? `"${recentPost.title}"` : 'Untitled Post'}</p>
                      <span className="text-[10px] text-gray-600 line-clamp-2">{recentPost.description || ''}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">No recent discussions found.</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">Top Community Art</p>
                <div className="h-32 bg-[#0a0a0a] rounded-lg flex items-center justify-center border border-dashed border-white/10 overflow-hidden">
                  {recentImagePost?.attachments?.[0] ? (
                    <img src={recentImagePost.attachments[0]} alt="Community Art" className="max-h-32 w-auto object-contain" />
                  ) : (
                    <span className="text-gray-700 font-black text-4xl">NO_ART</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GamesDashboard;