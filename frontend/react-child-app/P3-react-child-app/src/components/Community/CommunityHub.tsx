import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunityPosts, getCommunityPostsByType, createCommunityPost } from '../../api/community';
import type { CommunityPost } from './CommunityPost';
import CreatePostModal from './CreatePostModal';

const CommunityHub = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = ['All', 'FORUM_POST', 'SCREENSHOT', 'IMAGE', 'VIDEO', 'NEWS'];
  const filterLabels: Record<string, string> = {
    'All': 'All',
    'FORUM_POST': 'Discussions',
    'SCREENSHOT': 'Screenshots',
    'IMAGE': 'Artwork',
    'VIDEO': 'Videos',
    'NEWS': 'News'
  };

  useEffect(() => {
    loadPosts();
  }, [selectedFilter]);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = selectedFilter === 'All' 
        ? await getCommunityPosts()
        : await getCommunityPostsByType(selectedFilter);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData: {
    title: string;
    description: string;
    type: string;
    tags: string[];
  }) => {
    // Get user ID from localStorage or use a default (in a real app, this would come from auth)
    const userId = localStorage.getItem('userId') || '1';
    
    await createCommunityPost(postData, parseInt(userId));
    await loadPosts(); // Reload posts after creating
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Community Hero Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Community Hub</h1>
          <p className="text-gray-500 mt-2">Shared content and discussions from the P3 Fleet.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(filter => (
            <button 
              key={filter} 
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 text-xs font-bold uppercase transition-all rounded-sm ${
                selectedFilter === filter 
                  ? 'bg-[#822C2C] text-white' 
                  : 'bg-[#151515] text-gray-400 hover:bg-[#822C2C] hover:text-white'
              }`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {loading && (
            <div className="bg-[#151515] border border-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">Loading posts...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="bg-[#151515] border border-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No posts found. Be the first to create one!</p>
            </div>
          )}

          {!loading && !error && posts.map(post => (
            <div key={post.id} className="bg-[#151515] border border-white/5 rounded-lg overflow-hidden hover:border-[#822C2C]/30 transition-colors">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={post.author.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} 
                    className="w-8 h-8 rounded-full bg-[#822C2C]" 
                    alt={post.author.username}
                  />
                  <span className="text-sm font-bold text-[#822C2C]">{post.author.username}</span>
                  <span className="text-xs text-gray-600 uppercase">{formatDate(post.dateCreated)}</span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-black rounded">{post.type}</span>
                </div>
                <h2 
                  className="text-xl font-bold mb-3 hover:text-[#822C2C] cursor-pointer"
                  onClick={() => navigate(`/CommunityThreads?postId=${post.id}`)}
                >
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-black px-2 py-1 rounded border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-6 text-xs font-bold text-gray-500">
                  <button className="flex items-center space-x-2 hover:text-white">
                    <span>▲</span> 
                    <span>{post.likes || 0}</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 hover:text-white"
                    onClick={() => navigate(`/CommunityThreads?postId=${post.id}`)}
                  >
                    <span>💬</span> 
                    <span>View Post</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-[#822C2C] p-6 rounded-lg shadow-lg shadow-red-900/20">
            <h3 className="font-black uppercase tracking-tighter text-xl mb-2">Create Post</h3>
            <p className="text-sm text-red-100/70 mb-4">Share your progress or start a discussion with the fleet.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-black text-white font-bold rounded-sm hover:bg-white hover:text-black transition-all"
            >
              NEW TOPIC
            </button>
          </div>

          <div className="bg-[#151515] p-6 rounded-lg border border-white/5">
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-[0.2em] mb-4">Post Types</h3>
            <div className="flex flex-wrap gap-2">
              {['FORUM_POST', 'SCREENSHOT', 'IMAGE', 'VIDEO', 'NEWS'].map(type => (
                <span 
                  key={type} 
                  onClick={() => setSelectedFilter(type)}
                  className={`text-[10px] px-2 py-1 rounded border cursor-pointer transition-colors ${
                    selectedFilter === type
                      ? 'bg-[#822C2C] border-[#822C2C] text-white'
                      : 'bg-black border-white/10 hover:border-[#822C2C]'
                  }`}
                >
                  {filterLabels[type]}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityHub;