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
