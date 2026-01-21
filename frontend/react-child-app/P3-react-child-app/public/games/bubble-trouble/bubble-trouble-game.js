// Bubble Trouble Game Logic with Backend Integration

const API_BASE_URL = 'http://localhost:8080/api';
const GAME_ID = 1; // Bubble Trouble game ID

// Game Configuration
const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GRAVITY: 0.2,
  HARPOON_SPEED: 6,
  INITIAL_LIVES: 3,
  MAX_LEVEL: 10,
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 40,
  PLAYER_SPEED: 5,
  MIN_BUBBLE_RADIUS: 10,
  INITIAL_BUBBLE_RADIUS: 40,
  RESPAWN_DELAY: 1000,
  LEVEL_CLEAR_DELAY: 1000
};

const COLORS = {
  BACKGROUND: '#1a1a2e',
  GROUND: '#16213e',
  PLAYER: '#e94560',
  PLAYER_EYE: '#fff',
  HARPOON: '#00ff00',
  BUBBLE_STROKE: 'rgba(255,255,255,0.3)'
};

// Game State
let gameState = 'start';
let score = 0;
let level = 1;
let lives = GAME_CONFIG.INITIAL_LIVES;
let isRespawning = false;
let levelCleared = false;
let sessionId = null;
let sessionStartTime = null;

// Game Objects
let player = {
  x: GAME_CONFIG.CANVAS_WIDTH / 2,
  y: GAME_CONFIG.CANVAS_HEIGHT - 50,
  width: GAME_CONFIG.PLAYER_WIDTH,
  height: GAME_CONFIG.PLAYER_HEIGHT,
  speed: GAME_CONFIG.PLAYER_SPEED
};

let bubbles = [];
let harpoons = [];
let keys = {};

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const finalLevelEl = document.getElementById('finalLevel');
const gameOverTitle = document.getElementById('gameOverTitle');
const victoryText = document.getElementById('victoryText');

// Backend Communication
function getUserFromParent() {
  try {
    const userStr = localStorage.getItem('dawker_session_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error getting user:', e);
  }
  return null;
}

async function saveScoreToBackend(finalScore, finalLevel, completed) {
  const user = getUserFromParent();
  if (!user || user.id === undefined) {
    // Fallback for testing without login
    console.log('No user logged in, using dummy user ID 1');
  }
  const userId = user && user.id ? user.id : 1;

  try {
    const response = await fetch(`${API_BASE_URL}/game-scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        gameId: GAME_ID,
        score: finalScore,
        level: finalLevel,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log("Score saved successfully");
    } else {
      console.error("Failed to save score");
    }

  } catch (error) {
    console.error('Error saving score:', error);
  }
}

async function startGameSession() {
  const user = getUserFromParent();
  if (!user || !user.id) return;

  try {
    const response = await fetch(`${API_BASE_URL}/game/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        gameId: GAME_ID,
        startTime: new Date().toISOString()
      })
    });

    if (response.ok) {
      const session = await response.json();
      sessionId = session.id;
      sessionStartTime = new Date();
    }
  } catch (error) {
    console.error('Error starting session:', error);
  }
}

// Game Logic
function initLevel(levelNum) {
  bubbles = [];
  const numBubbles = levelNum;

  for (let i = 0; i < numBubbles; i++) {
    bubbles.push({
      x: 100 + i * 150,
      y: 200,
      radius: GAME_CONFIG.INITIAL_BUBBLE_RADIUS,
      vx: 1.5 + Math.random() * 1.5,
      vy: 0,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  }

  player.x = GAME_CONFIG.CANVAS_WIDTH / 2;
  harpoons = [];
}

function updateBubble(bubble) {
  bubble.vy += GAME_CONFIG.GRAVITY;
  bubble.y += bubble.vy;
  bubble.x += bubble.vx;

  if (bubble.y + bubble.radius >= GAME_CONFIG.CANVAS_HEIGHT) {
    bubble.y = GAME_CONFIG.CANVAS_HEIGHT - bubble.radius;
    bubble.vy = -Math.abs(bubble.vy);
    if (Math.abs(bubble.vy) < 4) {
      bubble.vy = -4;
    }
  }

  if (bubble.x - bubble.radius <= 0 || bubble.x + bubble.radius >= GAME_CONFIG.CANVAS_WIDTH) {
    bubble.vx *= -1;
    bubble.x = bubble.x - bubble.radius <= 0
      ? bubble.radius
      : GAME_CONFIG.CANVAS_WIDTH - bubble.radius;
  }
}

function checkCollision(bubble, player) {
  const dx = bubble.x - (player.x + player.width / 2);
  const dy = bubble.y - (player.y + player.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < bubble.radius + player.width / 2;
}

function splitBubble(bubble) {
  const newRadius = bubble.radius / 2;

  if (newRadius >= GAME_CONFIG.MIN_BUBBLE_RADIUS) {
    bubbles.push({
      x: bubble.x - 10,
      y: bubble.y,
      radius: newRadius,
      vx: -Math.abs(bubble.vx) - 1,
      vy: -5,
      color: bubble.color
    });
    bubbles.push({
      x: bubble.x + 10,
      y: bubble.y,
      radius: newRadius,
      vx: Math.abs(bubble.vx) + 1,
      vy: -5,
      color: bubble.color
    });
  }

  score += Math.floor(50 / bubble.radius);
  updateUI();
}

function render() {
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.GROUND;
  ctx.fillRect(0, GAME_CONFIG.CANVAS_HEIGHT - 10, GAME_CONFIG.CANVAS_WIDTH, 10);

  bubbles.forEach(bubble => {
    ctx.fillStyle = bubble.color;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.BUBBLE_STROKE;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.fillStyle = COLORS.PLAYER;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = COLORS.PLAYER_EYE;
  ctx.fillRect(player.x + 15, player.y, 10, 10);

  harpoons.forEach(harpoon => {
    ctx.fillStyle = COLORS.HARPOON;
    ctx.fillRect(harpoon.x - 2, harpoon.y, 4, GAME_CONFIG.CANVAS_HEIGHT - harpoon.y);
  });
}

function updateUI() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  livesEl.textContent = '❤️'.repeat(lives);
}

function gameLoop() {
  if (gameState !== 'playing') return;

  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight'] && player.x < GAME_CONFIG.CANVAS_WIDTH - player.width) {
    player.x += player.speed;
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    updateBubble(bubble);

    if (checkCollision(bubble, player) && !isRespawning) {
      isRespawning = true;
      const currentLevel = level;
      lives--;
      updateUI();

      if (lives > 0) {
        // Clear bubbles and harpoons immediately to prevent further collisions
        bubbles = [];
        harpoons = [];

        setTimeout(() => {
          initLevel(currentLevel);
          isRespawning = false;
        }, GAME_CONFIG.RESPAWN_DELAY);

        // Don't return or continue - let the game loop continue rendering
        break; // Exit the bubble loop since we cleared the array
      } else {
        endGame(false);
        return;
      }
    }

    let bubbleHit = false;
    for (let h = harpoons.length - 1; h >= 0; h--) {
      const harpoon = harpoons[h];
      const horizontalOverlap = Math.abs(bubble.x - harpoon.x) < bubble.radius + 2;
      const verticalOverlap = bubble.y + bubble.radius >= harpoon.y &&
        bubble.y - bubble.radius <= GAME_CONFIG.CANVAS_HEIGHT;

      if (horizontalOverlap && verticalOverlap) {
        splitBubble(bubble);
        bubbles.splice(i, 1);
        harpoons.splice(h, 1);
        bubbleHit = true;
        break;
      }
    }

    if (bubbleHit) continue;
  }

  for (let h = harpoons.length - 1; h >= 0; h--) {
    harpoons[h].y -= GAME_CONFIG.HARPOON_SPEED;
    if (harpoons[h].y < 0) {
      harpoons.splice(h, 1);
    }
  }

  if (bubbles.length === 0 && !isRespawning && !levelCleared) {
    levelCleared = true;
    const currentLevel = level;

    setTimeout(() => {
      if (currentLevel >= GAME_CONFIG.MAX_LEVEL) {
        endGame(true);
      } else {
        level = currentLevel + 1;
        updateUI();
        initLevel(level);
      }
      levelCleared = false;
    }, GAME_CONFIG.LEVEL_CLEAR_DELAY);
  }

  render();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  level = 1;
  lives = GAME_CONFIG.INITIAL_LIVES;
  isRespawning = false;
  levelCleared = false;
  gameState = 'playing';

  updateUI();
  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');

  initLevel(1);
  startGameSession();
  gameLoop();
}

function endGame(victory) {
  gameState = 'gameOver';
  finalScoreEl.textContent = score;
  finalLevelEl.textContent = level;

  if (victory) {
    gameOverTitle.textContent = 'You Won!';
    victoryText.classList.remove('hidden');
  } else {
    gameOverTitle.textContent = 'Game Over!';
    victoryText.classList.add('hidden');
  }

  gameOverOverlay.classList.remove('hidden');
  saveScoreToBackend(score, level, victory);
}

// Event Listeners
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === ' ' && gameState === 'playing') {
    e.preventDefault();
    harpoons.push({
      x: player.x + player.width / 2,
      y: player.y
    });
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Initial render
render();
