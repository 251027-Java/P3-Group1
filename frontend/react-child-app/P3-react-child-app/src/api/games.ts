/**
 * Games API client
 */

import http from './http';
import type { Game, Review, CreateReviewRequest } from '../types';

/**
 * Get all games
 */
export async function getGames(): Promise<Game[]> {
  return http<Game[]>('/games');
}

/**
 * Get a single game by ID
 */
export async function getGameById(id: number | string): Promise<Game> {
  return http<Game>(`/games/${id}`);
}

/**
 * Get all reviews for a specific game
 */
export async function getReviewsByGameId(id: number | string): Promise<Review[]> {
  return http<Review[]>(`/games/${id}/reviews`);
}

/**
 * Create a new review for a game
 * Requires X-User-Id header to simulate authentication
 */
export async function createReview(
  gameId: number | string,
  payload: CreateReviewRequest,
  userId?: number | string
): Promise<Review> {
  const headers: Record<string, string> = {};
  
  if (userId) {
    headers['X-User-Id'] = String(userId);
  }

  return http<Review>(`/games/${gameId}/reviews`, {
    method: 'POST',
    headers,
    body: payload,
  });
}
