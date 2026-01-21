/**
 * User Profile API client
 * Handles user-specific operations like library, wishlist, and profile updates
 */

import http from './http';
import type { Game, User } from '../types';

/**
 * Get user by ID with full profile information
 */
export async function getUserById(userId: number): Promise<User> {
  return http<User>(`/users/${userId}`);
}

/**
 * Get user's friends list
 */
export async function getUserFriends(userId: number): Promise<User[]> {
  return http<User[]>(`/users/${userId}/friends`);
}

/**
 * Get user's games library (full Game objects)
 */
export async function getUserGamesLibrary(userId: number): Promise<Game[]> {
  return http<Game[]>(`/users/${userId}/library/full`);
}

/**
 * Get user's wishlist (full Game objects)
 */
export async function getUserWishlist(userId: number): Promise<Game[]> {
  return http<Game[]>(`/users/${userId}/wishlist/full`);
}

/**
 * Update user profile
 */
export interface UpdateProfileRequest {
  displayName?: string;
  displayImage?: string;
  level?: 'USER' | 'DEVELOPER' | 'ADMIN';
  canSell?: boolean;
}

export async function updateUserProfile(
  userId: number,
  updates: UpdateProfileRequest
): Promise<User> {
  return http<User>(`/users/${userId}/profile`, {
    method: 'PUT',
    body: updates,
  });
}

/**
 * Add game to user's library
 */
export async function addGameToLibrary(userId: number, gameId: number): Promise<{ message: string }> {
  return http<{ message: string }>(`/users/${userId}/library/${gameId}`, {
    method: 'POST',
  });
}

/**
 * Remove game from user's library
 */
export async function removeGameFromLibrary(userId: number, gameId: number): Promise<{ message: string }> {
  return http<{ message: string }>(`/users/${userId}/library/${gameId}`, {
    method: 'DELETE',
  });
}

/**
 * Add game to wishlist
 */
export async function addGameToWishlist(userId: number, gameId: number): Promise<{ message: string }> {
  return http<{ message: string }>(`/users/${userId}/wishlist/${gameId}`, {
    method: 'POST',
  });
}

/**
 * Remove game from wishlist
 */
export async function removeGameFromWishlist(userId: number, gameId: number): Promise<{ message: string }> {
  return http<{ message: string }>(`/users/${userId}/wishlist/${gameId}`, {
    method: 'DELETE',
  });
}

/**
 * Get user statistics
 */
export interface UserStatistics {
  userId: number;
  displayName: string;
  level: string;
  canSell: boolean;
  totalGames: number;
  totalWishlist: number;
  totalFriends: number;
  totalRewards: number;
  totalPosts: number;
  unreadNotifications: number;
}

export async function getUserStatistics(userId: number): Promise<UserStatistics> {
  return http<UserStatistics>(`/users/${userId}/statistics`);
}
