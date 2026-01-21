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
  attachments?: string[];
  likes: number;
  author: User;
  tags?: string[];
  comments?: any[];
}

