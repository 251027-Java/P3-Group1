import React, { useState } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: {
    title: string;
    description: string;
    type: string;
    tags: string[];
  }) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('FORUM_POST');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const postTypes = [
    { value: 'FORUM_POST', label: 'Discussion' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'SCREENSHOT', label: 'Screenshot' },
    { value: 'NEWS', label: 'News' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        type,
        tags
      });

      // Reset form
      setTitle('');
      setDescription('');
      setType('FORUM_POST');
      setTags([]);
      setTagInput('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      setType('FORUM_POST');
      setTags([]);
      setTagInput('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#151515]">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Create New Topic</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white text-2xl leading-none disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#822C2C] uppercase tracking-widest mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none"
              placeholder="Enter post title..."
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Post Type */}
          <div>
            <label className="block text-xs font-bold text-[#822C2C] uppercase tracking-widest mb-2">
              Post Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none"
              disabled={isSubmitting}
              required
            >
              {postTypes.map(pt => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#822C2C] uppercase tracking-widest mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none resize-none h-32"
              placeholder="Describe your post..."
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[#822C2C] uppercase tracking-widest mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded px-4 py-2 text-white focus:border-[#822C2C] focus:outline-none"
                placeholder="Add tags (press Enter)..."
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#822C2C] text-white font-bold text-xs uppercase rounded hover:bg-[#a03636] transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-black px-3 py-1 rounded border border-white/10 flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0a0a0a] text-white font-bold text-xs uppercase rounded hover:bg-[#151515] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#822C2C] text-white font-bold text-xs uppercase rounded hover:bg-[#a03636] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
