/**
 * Type definitions for the application
 */

export interface User {
  id: number;
  displayName: string;
  displayImage?: string;
  level: 'USER' | 'DEVELOPER' | 'ADMIN';
  canSell: boolean;
}

export interface Game {
  id: number;
  name: string;
  dateReleased?: string;
  rating?: number;
  developer: string;
  publisher: string;
  size?: string;
  profileImage?: string;
  backgroundImage?: string;
  price: number;
  salePercent?: number;
  onSale: boolean;
  tags: string[];
  developerLogs?: Array<{
    title: string;
    description: string;
  }>;
  rewards?: Array<{
    id: number;
    title: string;
    cost: number;
  }>;
  reviews?: Review[];
}

export interface Review {
  id: number;
  ratingNumber: number;
  content: string;
  likes: number;
  createdAt: string;
  user: User;
  game?: Partial<Game>;
}

export interface CreateReviewRequest {
  ratingNumber: number;
  content: string;
}

// User API DTOs
export interface userDTO {
  id: number;
  email: string;
  displayName: string;
  displayImage?: string;
  level?: 'USER' | 'DEVELOPER' | 'ADMIN';
  canSell?: boolean;
  tokens?: number;
}

export interface RegisterDTO {
  email: string;
  userPassword: string;
  displayName: string;
  displayImage?: string;
}

export interface commentsPostDTO {
  id?: number;
  userId: number;
  content: string;
  threadId?: number;
  createdAt?: string;
}
