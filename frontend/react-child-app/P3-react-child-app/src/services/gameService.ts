import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface GameScore {
  id?: number;
  userId: number;
  gameId: number;
  score: number;
  level?: number;
  timestamp?: string;
}

export interface GameScoreResponse {
  id: number;
  user: {
    id: number;
    displayName: string;
  };
  game: {
    id: number;
    name: string;
  };
  score: number;
  level: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  level?: number;
  timestamp: string;
}

class GameService {
  /**
   * Submit a new game score
   */
  async submitScore(gameScore: GameScore): Promise<GameScoreResponse> {
    const response = await axios.post<GameScoreResponse>(
      `${API_BASE_URL}/game-scores`,
      gameScore
    );
    return response.data;
  }

  /**
   * Get leaderboard for a specific game
   */
  async getLeaderboard(gameId: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await axios.get<LeaderboardEntry[]>(
      `${API_BASE_URL}/game-scores/leaderboard/${gameId}`,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * Get user's best score for a game
   */
  async getUserBestScore(userId: number, gameId: number): Promise<GameScoreResponse | null> {
    try {
      const response = await axios.get<GameScoreResponse>(
        `${API_BASE_URL}/game-scores/user/${userId}/game/${gameId}/best`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all scores for a user in a specific game
   */
  async getUserGameScores(userId: number, gameId: number): Promise<GameScoreResponse[]> {
    const response = await axios.get<GameScoreResponse[]>(
      `${API_BASE_URL}/game-scores/user/${userId}/game/${gameId}`
    );
    return response.data;
  }

  /**
   * Get game entity by name
   */
  async getGameByName(name: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/games/name/${name}`);
    return response.data;
  }

  /**
   * Create a new game entity (if it doesn't exist)
   */
  async createGame(name: string, description: string): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/games`, {
      name,
      description
    });
    return response.data;
  }
}

export default new GameService();
