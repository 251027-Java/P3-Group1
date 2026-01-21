/**
 * Community API client
 */

import http from './http';
import type { CommunityPost } from '../components/Community/CommunityPost';

export interface CreatePostRequest {
  title: string;
  description: string;
  type: string;
  tags?: string[];
  attachments?: string[];
}

/**
 * Get all community posts
 */
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return http<CommunityPost[]>('/community/posts');
}

/**
 * Get posts filtered by type
 */
export async function getCommunityPostsByType(type: string): Promise<CommunityPost[]> {
  return http<CommunityPost[]>(`/community/posts/type/${type}`);
}

/**
 * Get a single post by ID
 */
export async function getCommunityPostById(id: number | string): Promise<CommunityPost> {
  return http<CommunityPost>(`/community/posts/${id}`);
}

/**
 * Create a new community post
 * Requires X-User-Id header to simulate authentication
 */
export async function createCommunityPost(
  payload: CreatePostRequest,
  userId?: number | string
): Promise<CommunityPost> {
  const headers: Record<string, string> = {};
  
  if (userId) {
    headers['X-User-Id'] = String(userId);
  }

  return http<CommunityPost>('/community/posts', {
    method: 'POST',
    headers,
    body: payload,
  });
}
