import http from './http';

export interface CreatePostRequest {
  title: string;
  description: string;
  type: string;
  tags?: string[];
  attachments?: string[];
}

export const getCommunityPosts = async () => {
  try {
    return await http('/community/posts');
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
};

export const getCommunityPostsByType = async (type: string) => {
  try {
    return await http(`/community/posts/type/${type}`);
  } catch (error) {
    console.error(`Error fetching posts by type ${type}:`, error);
    throw error;
  }
};

export const getCommunityPostById = async (id: number) => {
  try {
    return await http(`/community/posts/${id}`);
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
