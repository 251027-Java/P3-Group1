import http from './http';
import type { CommunityPost } from '../components/Community/CommunityPost';

export interface CreatePostRequest {
  title: string;
  description: string;
  type: string;
  tags?: string[];
  attachments?: string[];
}

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    const data = await http<CommunityPost[]>('/community/posts');
    
    // 💡 The "Better Way" to see what is returned:
    console.log('📦 API Response Data:', data);
    console.table(data); // Displays the array as a nice readable table in the console
    
    return data;
  } catch (error) {
    console.error('❌ Community Service Error:', error);
    throw error; 
  }
};
export const getCommunityPostsByType = async (type: string): Promise<CommunityPost[]> => {
  try {
    return await http<CommunityPost[]>(`/community/posts/type/${type}`);
  } catch (error) {
    console.error(`Error fetching posts by type ${type}:`, error);
    throw error;
  }
};

export const getCommunityPostById = async (id: number): Promise<CommunityPost> => {
  try {
    return await http<CommunityPost>(`/community/posts/${id}`);
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createCommunityPost = async (payload: CreatePostRequest, userId: number) => {
  try {
    return await http('/community/posts', {
      method: 'POST',
      headers: {
        'X-User-Id': userId.toString()
      },
      body: payload
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
};
