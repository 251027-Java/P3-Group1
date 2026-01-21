import { http } from './http';

export interface CreatePostRequest {
  title: string;
  description: string;
  type: string;
  tags?: string[];
  attachments?: string[];
}

export const getCommunityPosts = async () => {
  try {
    const response = await http.get('/api/community/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
};

export const getCommunityPostsByType = async (type: string) => {
  try {
    const response = await http.get(`/api/community/posts/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts by type ${type}:`, error);
    throw error;
  }
};

export const getCommunityPostById = async (id: number) => {
  try {
    const response = await http.get(`/api/community/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createCommunityPost = async (payload: CreatePostRequest, userId: number) => {
  try {
    const response = await http.post('/api/community/posts', payload, {
      headers: {
        'X-User-Id': userId.toString()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating community post:', error);
    throw error;
  }
};
