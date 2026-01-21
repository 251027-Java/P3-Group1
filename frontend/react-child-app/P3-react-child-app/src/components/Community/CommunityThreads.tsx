import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCommunityPostById } from '../../api/community';
import type { CommunityPost } from './CommunityPost';
import http from '../../api/http';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    profilePictureUrl?: string;
  };
  dateCreated: string;
}

const CommunityThreads = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');
  
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postId) {
      loadPost();
      loadComments();
    }
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await getCommunityPostById(postId);
      setPost(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!postId) return;
    
    try {
      const data = await http<Comment[]>(`/community/posts/${postId}/comments`);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/CommunityHub')}
            className="text-[#822C2C] text-xs font-bold uppercase mb-6"
          >
            ← Back to Hub
          </button>
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error || 'Post not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/CommunityHub')}
          className="text-[#822C2C] text-xs font-bold uppercase mb-6"
        >
          ← Back to Hub
        </button>
        
        {/* Original Post */}
        <div className="bg-[#151515] p-8 rounded-t-2xl border-x border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <span className="text-xs text-gray-500 px-3 py-1 bg-black rounded border border-white/10">
              {post.type}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
             <img 
               src={post.author.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} 
               className="w-10 h-10 rounded-full" 
               alt={post.author.username}
             />
             <div>
               <p className="text-sm font-bold">{post.author.username}</p>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                 Post Author | {formatDate(post.dateCreated)}
               </p>
             </div>
          </div>
          
          <div className="prose prose-invert max-w-none text-gray-300 mb-6">
            <p>{post.description}</p>
          </div>

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
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-[#0a0a0a] border-x border-b border-white/5 rounded-b-2xl">
          <div className="p-8 space-y-8">
            <h3 className="text-xs font-black text-[#822C2C] uppercase tracking-widest">
              {comments.length} Response{comments.length !== 1 ? 's' : ''}
            </h3>
            
            {/* Comments */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex space-x-4">
                  <div className="w-1 h-auto bg-gradient-to-b from-[#822C2C] to-transparent"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <img 
                        src={comment.author.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`}
                        className="w-6 h-6 rounded-full"
                        alt={comment.author.username}
                      />
                      <p className="text-xs font-bold">
                        {comment.author.username}{' '}
                        <span className="text-gray-600 font-normal ml-2">
                          {formatDate(comment.dateCreated)}
                        </span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">{comment.content}</p>
                  </div>
                </div>
              ))
            )}

            {/* Reply Area */}
            <div className="mt-12 bg-[#151515] p-6 rounded-xl border border-[#822C2C]/30">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-700 h-24 resize-none"
                placeholder="Write your response..."
              ></textarea>
              <div className="flex justify-end mt-4">
                <button className="px-6 py-2 bg-[#822C2C] text-white font-bold text-xs uppercase rounded-sm hover:bg-[#a03636] transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityThreads;