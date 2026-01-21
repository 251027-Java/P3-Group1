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
  
  const getCurrentUserId = (): string | null => {
    return localStorage.getItem('userId') || '1'; 
  };
  
  const hasUserReviewed = (): boolean => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    // Added ?. safety check here
    return reviews.some(review => review.user?.id === parseInt(userId));
  };

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
      setReviews(prev => [newReview, ...prev]);
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
    const sum = reviews.reduce((acc, review) => acc + (review.ratingNumber || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
      <div className="relative h-[60vh] w-full overflow-hidden">
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
            <div className="w-64 h-96 bg-[#151515] rounded-lg shadow-2xl shadow-black border border-white/10 overflow-hidden flex-shrink-0">
              {game.profileImage ? (
                <img src={game.profileImage} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#822C2C] to-black flex items-center justify-center p-6 text-center">
                  <span className="text-4xl font-black italic tracking-tighter uppercase">{game.name}</span>
                </div>
              )}
            </div>

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
                {game.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md w-fit">
                <div className="pr-4 border-r border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Price</p>
                  {game.onSale && game.salePercent ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">${(game.price || 0).toFixed(2)}</p>
                      <p className="text-xl font-mono text-[#822C2C]">
                        ${((game.price || 0) * (1 - (game.salePercent || 0) / 100)).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-mono text-[#822C2C]">${(game.price || 0).toFixed(2)}</p>
                  )}
                </div>
                <button className="px-8 py-3 bg-[#822C2C] hover:bg-[#a13737] font-bold rounded text-sm transition-all uppercase tracking-widest shadow-lg shadow-red-900/40">
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

      <div className="container mx-auto px-8 py-12 grid grid-cols-12 gap-12">
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

          {activeTab === 'About' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-[#822C2C] uppercase italic">About This Game</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {game.name} - Experience an immersive gaming adventure. 
                {game.developer && ` Developed by ${game.developer}`}
                {game.publisher && ` and published by ${game.publisher}`}.
              </p>
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
              </div>
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
                          className={`text-2xl ${star <= reviewRating ? 'text-[#822C2C]' : 'text-gray-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded p-3 text-sm min-h-[120px]"
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-[#822C2C] font-bold rounded">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2 bg-white/10 font-bold rounded">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-[#151515] p-6 rounded-lg border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#822C2C] flex items-center justify-center">
                          {review.user?.displayName?.substring(0, 1).toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.user?.displayName || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#822C2C]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < (review.ratingNumber || 0) ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">User Ratings</h4>
            {reviews.length > 0 ? (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-[#822C2C]">{ratingPercentage}%</span>
                  <span className="text-xs text-gray-400 mb-1">
                    {(avgRating || 0).toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="mt-4 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#822C2C]" style={{ width: `${ratingPercentage}%` }} />
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </section>

          <section className="bg-[#151515] p-6 rounded-2xl border border-white/5 space-y-4">
            {game.developer && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Developer</p>
                <p className="text-sm font-bold text-[#822C2C]">{game.developer}</p>
              </div>
            )}
            {game.dateReleased && (
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Release Date</p>
                <p className="text-sm font-bold">{formatDate(game.dateReleased)}</p>
              </div>
            )}
          </section>

          {game.tags?.length > 0 && (
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
        </aside>
      </div>
    </div>
  );
};

export default GameProfile;