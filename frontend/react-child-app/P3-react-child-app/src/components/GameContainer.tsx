import React, { useState, useEffect } from 'react';
import { BubbleTrouble } from '../games/bubble-trouble';
import { FlappyBird } from '../games/flappy-bird';
import gameService from '../services/gameService';
import './GameContainer.css';

interface GameContainerProps {
  gameName: 'bubble-trouble' | 'flappy-bird';
  userId: number;
  onClose?: () => void;
}

/**
 * GameContainer Component
 * 
 * Wraps games in an iframe-like container and handles:
 * - Score submission to backend
 * - Leaderboard display
 * - Game state management
 */
const GameContainer: React.FC<GameContainerProps> = ({
  gameName,
  userId,
  onClose
}) => {
  const [gameId, setGameId] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBestScore, setUserBestScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const gameNames = {
    'bubble-trouble': 'Bubble Trouble',
    'flappy-bird': 'Flappy Bird'
  };

  const gameDescriptions = {
    'bubble-trouble': 'Pop all the bubbles without getting hit!',
    'flappy-bird': 'Tap to flap and avoid the pipes!'
  };

  useEffect(() => {
    initializeGame();
  }, [gameName]);

  const initializeGame = async () => {
    try {
      setLoading(true);
      const gameFullName = gameNames[gameName];
      
      // Try to get existing game or create it
      let game;
      try {
        game = await gameService.getGameByName(gameFullName);
      } catch (error) {
        // Game doesn't exist, create it
        game = await gameService.createGame(
          gameFullName,
          gameDescriptions[gameName]
        );
      }

      setGameId(game.id);

      // Load user's best score
      const bestScore = await gameService.getUserBestScore(userId, game.id);
      if (bestScore) {
        setUserBestScore(bestScore.score);
      }

      // Load leaderboard
      await loadLeaderboard(game.id);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (gId: number) => {
    try {
      const data = await gameService.getLeaderboard(gId, 10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleScoreSubmit = async (score: number, level?: number) => {
    if (!gameId) return;

    try {
      await gameService.submitScore({
        userId,
        gameId,
        score,
        level
      });

      // Update best score if this is better
      if (score > userBestScore) {
        setUserBestScore(score);
      }

      // Reload leaderboard
      await loadLeaderboard(gameId);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const renderGame = () => {
    if (gameName === 'bubble-trouble') {
      return <BubbleTrouble onGameOver={(score, level) => handleScoreSubmit(score, level)} />;
    } else {
      return <FlappyBird onGameOver={(score) => handleScoreSubmit(score)} />;
    }
  };

  if (loading) {
    return (
      <div className="game-container-loading">
        <div className="spinner"></div>
        <p>Loading {gameNames[gameName]}...</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-info">
          <h1>{gameNames[gameName]}</h1>
          <p className="game-best-score">Your Best: {userBestScore}</p>
        </div>
        <div className="game-actions">
          <button 
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="btn-leaderboard"
          >
            {showLeaderboard ? '🎮 Play' : '🏆 Leaderboard'}
          </button>
          {onClose && (
            <button onClick={onClose} className="btn-close">✕</button>
          )}
        </div>
      </div>

      {showLeaderboard ? (
        <div className="leaderboard-container">
          <h2>🏆 Top Players</h2>
          {leaderboard.length === 0 ? (
            <p className="no-scores">No scores yet. Be the first!</p>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div 
                  key={index} 
                  className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}
                >
                  <span className="rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </span>
                  <span className="player-name">{entry.displayName}</span>
                  <span className="score">{entry.score}</span>
                  {entry.level && <span className="level">Lv.{entry.level}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="game-content">
          {renderGame()}
        </div>
      )}
    </div>
  );
};

export default GameContainer;
