// CommunityPost.ts
// TypeScript type for a Community Post entity

export interface User {
  id: number;
  username: string;
  profilePictureUrl?: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  description: string;
  type: string;
  dateCreated: string; // ISO string
  likes: number;
  author: User;
  tags?: string[];
  attachments?: string[];
  comments?: any[]; // Comment type can be defined separately
}
