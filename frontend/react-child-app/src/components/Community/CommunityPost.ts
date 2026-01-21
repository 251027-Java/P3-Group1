// CommunityPost.ts
// TypeScript type for a Community Post entity

export interface CommunityPost {
  id: number;
  title: string;
  description: string;
  type?: string;
  dateCreated: string; // ISO string
  attachments?: string[];
  // Add more fields as needed from backend
}
