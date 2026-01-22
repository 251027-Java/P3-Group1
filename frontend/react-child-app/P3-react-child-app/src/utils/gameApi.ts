const API_BASE_URL = 'http://localhost:8080/api';

export interface GameScore {
  userId: number;
  gameId: number;
  score: number;
  level?: number;
  timestamp: string;
}

export interface GameSession {
  id?: number;
  userId: number;
  gameId: number;
  startTime: string;
  endTime?: string;
  score: number;
  level?: number;
  completed: boolean;
}

export interface GameStats {
  userId: number;
  gameId: number;
  highScore: number;
  totalPlays: number;
  totalPlayTime: number;
  lastPlayed: string;
}

class GameApiService {
  /**
   * Save game score to backend
   */
  saveScore = async (gameScore: GameScore): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameScore),
      });

      if (!response.ok) {
        throw new Error(`Failed to save score: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving game score:', error);
      throw error;
    }
  };

  /**
   * Start a new game session
   */
  startSession = async (session: Omit<GameSession, 'id' | 'endTime' | 'score' | 'completed'>): Promise<GameSession> => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting game session:', error);
      throw error;
    }
  };

  /**
   * End a game session
   */
  endSession = async (sessionId: number, score: number, level: number, completed: boolean): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/session/${sessionId}/end`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, level, completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end session: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  };

  /**
   * Get user's game statistics
   */
  getGameStats = async (userId: number, gameId: number): Promise<GameStats | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/stats/${userId}/${gameId}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  };

  /**
   * Get high scores for a game
   */
  getHighScores = async (gameId: number, limit: number = 10): Promise<GameScore[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/${gameId}/highscores?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to get high scores: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting high scores:', error);
      return [];
    }
  };

  /**
   * Add game to user's library
   */
  addToLibrary = async (userId: number, gameId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/${userId}/library/${gameId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to add to library: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding to library:', error);
      throw error;
    }
  };

  /**
   * Check if game is in user's library
   */
  isInLibrary = async (userId: number, gameId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/${userId}/library/${gameId}`);
      return response.ok;
    } catch (error) {
      console.error('Error checking library:', error);
      return false;
    }
  };
}

export const gameAPI = new GameApiService();
