import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGameById, getReviewsByGameId, createReview } from '../../api/games';
import type { Game, Review } from '../../types';
import { HttpError } from '../../api/http';

const GameProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('About');
  
  // State for game and reviews
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Simple auth simulation - in real app, this would come from auth context
  const getCurrentUserId = (): string | null => {
    return localStorage.getItem('userId') || '1'; // Default to user 1 for demo
  };
  
  const hasUserReviewed = (): boolean => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    return reviews.some(review => review.user.id === parseInt(userId));
  };

  // Load game and reviews on mount and when ID changes
  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [gameData, reviewsData] = await Promise.all([
          getGameById(id),
          getReviewsByGameId(id)
        ]);
        
        setGame(gameData);
        setReviews(reviewsData);
      } catch (err) {
        if (err instanceof HttpError) {
          if (err.status === 404) {
            setError('Game not found');
          } else {
            setError(`Failed to load game: ${err.message}`);
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = getCurrentUserId();
    if (!userId) {
      setSubmitError('You must be logged in to submit a review');
      return;
    }
    
    if (hasUserReviewed()) {
      setSubmitError('You have already reviewed this game');
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const newReview = await createReview(
        id!,
        {
          ratingNumber: reviewRating,
          content: reviewContent.trim()
        },
        userId
      );
      
      // Add the new review to the list
      setReviews(prev => [newReview, ...prev]);
      
      // Reset form
      setReviewContent('');
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err) {
      if (err instanceof HttpError) {
        const errorData = err.data as { error?: string };
        setSubmitError(errorData?.error || err.message);
      } else {
        setSubmitError('Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.ratingNumber, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#822C2C] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#822C2C] mb-4">Error</h2>
          <p className="text-gray-400 mb-8">{error || 'Game not found'}</p>
          <a href="/GamesDashboard" className="px-6 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded transition-all">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const avgRating = calculateAverageRating();
  const ratingPercentage = reviews.length > 0 ? Math.round((avgRating / 5) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. HERO HEADER SECTION */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Dynamic Background Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-30"
          style={{
            backgroundImage: game.backgroundImage 
              ? `url(${game.backgroundImage})` 
              : "url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Game Cover Art */}
            <div className="w-64 h-96 bg-[#151515] rounded-lg shadow-2xl shadow-black border border-white/10 overflow-hidden flex-shrink-0">
              {game.profileImage ? (
                <img src={game.profileImage} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#822C2C] to-black flex items-center justify-center p-6 text-center">
                  <span className="text-4xl font-black italic tracking-tighter uppercase">{game.name}</span>
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {game.onSale && (
                  <span className="px-2 py-1 bg-[#822C2C] text-[10px] font-bold uppercase rounded">
                    {game.salePercent}% OFF
                  </span>
                )}
                {game.dateReleased && (
                  <span className="text-gray-400 text-xs uppercase tracking-widest">
                    Released: {formatDate(game.dateReleased)}
                  </span>
                )}
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 italic">{game.name}</h1>
              <div className="flex gap-2 mb-6 flex-wrap">
                {game.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Action Bar */}
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md w-fit">
                <div className="pr-4 border-r border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Price</p>
                  {game.onSale && game.salePercent ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">${game.price.toFixed(2)}</p>
                      <p className="text-xl font-mono text-[#822C2C]">
                        ${(game.price * (1 - game.salePercent / 100)).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-mono text-[#822C2C]">${game.price.toFixed(2)}</p>
                  )}
                </div>
                <button onClick={async () => {
                    const user = userAPI.currentUser;
                    if(!user || !user.id){
                      alert('Please sign in to play.');
                      return;
                    }
                    try{
                      const balance = await userAPI.getBalance(user.id);
                      if(balance < 10){
                        alert('You do not have enough tokens. Please purchase tokens.');
                        return;
                      }
                      const res = await userAPI.createTransaction(user.id, -10, 'PLAY: Cyber Protocol');
                      alert('Play started — 10 tokens deducted. Current balance: ' + res.balance);
                    } catch(e){
                      console.error(e);
                      alert('Could not start play. Try again later.');
                    }
                  }} className="px-8 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded text-sm transition-all uppercase tracking-widest shadow-lg shadow-red-900/40">
                  Play (10 tokens)
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded border border-white/10">
                  ❤️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENT TABS & BODY */}
      <div className="container mx-auto px-8 py-12 grid grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8">
          <nav className="flex gap-8 border-b border-white/10 mb-8">
            {['About', 'System Requirements', 'Updates', 'Reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'border-b-2 border-[#822C2C] text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          {activeTab === 'About' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-[#822C2C] uppercase italic">About This Game</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {game.name} - Experience an immersive gaming adventure. 
                {game.developer && ` Developed by ${game.developer}`}
                {game.publisher && ` and published by ${game.publisher}`}.
              </p>
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="aspect-video bg-[#151515] rounded border border-white/5 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-tr from-black to-[#822C2C33]" />
                </div>
                <div className="aspect-video bg-[#151515] rounded border border-white/5 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-tl from-black to-[#822C2C33]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'System Requirements' && (
            <div className="space-y-6">
              <h3 className="text-[#822C2C] uppercase italic">System Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#151515] p-6 rounded-lg border border-white/5">
                  <h4 className="text-sm font-bold mb-4 text-gray-400 uppercase">Minimum</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><strong>OS:</strong> Windows 10</li>
                    <li><strong>Processor:</strong> Intel i5-7400</li>
                    <li><strong>Memory:</strong> 8 GB RAM</li>
                    <li><strong>Graphics:</strong> GTX 1050</li>
                    {game.size && <li><strong>Storage:</strong> {game.size}</li>}
                  </ul>
                </div>
                <div className="bg-[#151515] p-6 rounded-lg border border-white/5">
                  <h4 className="text-sm font-bold mb-4 text-gray-400 uppercase">Recommended</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><strong>OS:</strong> Windows 11</li>
                    <li><strong>Processor:</strong> Intel i7-9700K</li>
                    <li><strong>Memory:</strong> 16 GB RAM</li>
                    <li><strong>Graphics:</strong> RTX 3060</li>
                    {game.size && <li><strong>Storage:</strong> {game.size}</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Updates' && (
            <div className="space-y-6">
              <h3 className="text-[#822C2C] uppercase italic">Developer Updates</h3>
              {game.developerLogs && game.developerLogs.length > 0 ? (
                game.developerLogs.map((log, idx) => (
                  <div key={idx} className="bg-[#151515] p-6 rounded-lg border-l-4 border-[#822C2C]">
                    <h4 className="font-bold text-lg mb-2">{log.title}</h4>
                    <p className="text-gray-400 text-sm">{log.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No developer updates available yet.</p>
              )}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#822C2C] uppercase italic">User Reviews</h3>
                {!hasUserReviewed() && !showReviewForm && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-[#822C2C] hover:bg-[#a13737] font-bold text-sm rounded transition-all uppercase"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && !hasUserReviewed() && (
                <form onSubmit={handleSubmitReview} className="bg-[#151515] p-6 rounded-lg border border-white/10 mb-6">
                  <h4 className="font-bold mb-4">Write Your Review</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl ${star <= reviewRating ? 'text-[#822C2C]' : 'text-gray-600'} hover:scale-110 transition-transform`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-400">({reviewRating}/5)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Your Review</label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Share your thoughts about this game..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-sm min-h-[120px] focus:outline-none focus:border-[#822C2C]"
                      required
                    />
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-900 rounded text-sm text-red-400">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setSubmitError(null);
                      }}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 font-bold rounded transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {hasUserReviewed() && (
                <div className="bg-blue-900/20 border border-blue-900 rounded p-4 mb-6 text-sm text-blue-400">
                  ✓ You have already reviewed this game
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-[#151515] p-6 rounded-lg border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#822C2C] to-black flex items-center justify-center">
                            {review.user.displayImage ? (
                              <img src={review.user.displayImage} alt={review.user.displayName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold">{review.user.displayName.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{review.user.displayName || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.ratingNumber ? 'text-[#822C2C]' : 'text-gray-600'}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{review.content}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <button className="hover:text-[#822C2C] transition-colors">
                          👍 {review.likes} Helpful
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg italic">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. SIDEBAR INFO */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          {/* Review Stats */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">User Ratings</h4>
            {reviews.length > 0 ? (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-[#822C2C]">{ratingPercentage}%</span>
                  <span className="text-xs text-gray-400 mb-1">
                    {avgRating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="mt-4 w-full h-1 bg-gray-800 rounded-full">
                  <div className="h-full bg-[#822C2C]" style={{ width: `${ratingPercentage}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </section>

          {/* Developer Details */}
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5 space-y-4">
            {game.developer && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Developer</p>
                <p className="text-sm font-bold text-[#822C2C] hover:underline cursor-pointer">{game.developer}</p>
              </div>
            )}
            {game.publisher && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Publisher</p>
                <p className="text-sm font-bold">{game.publisher}</p>
              </div>
            )}
            {game.dateReleased && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Release Date</p>
                <p className="text-sm font-bold">{formatDate(game.dateReleased)}</p>
              </div>
            )}
          </section>

          {/* Tags */}
          {game.tags.length > 0 && (
            <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {game.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Rewards */}
          {game.rewards && game.rewards.length > 0 && (
            <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">In-Game Rewards</h4>
              <div className="space-y-3">
                {game.rewards.map((reward, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{reward.title}</span>
                    <span className="text-[#822C2C] font-bold">{reward.cost} coins</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

      </div>
    </div>
  );
};

export default GameProfile;
