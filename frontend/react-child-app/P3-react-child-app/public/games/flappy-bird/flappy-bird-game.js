// Flappy Bird Game Logic with Backend Integration

const API_BASE_URL = 'http://localhost:8080/api';
const GAME_ID = 2; // Flappy Bird game ID

// Game Configuration
const GAME_CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.25,
    JUMP_STRENGTH: -4.5,
    PIPE_SPEED: 2,
    PIPE_SPAWN_RATE: 150, // Frames between pipes
    PIPE_GAP: 150,
    BIRD_SIZE: 20
};

// Game State
let gameState = 'start';
let score = 0;
let highScore = 0;
let frames = 0;
let animationId = null;

// Game Objects
let bird = {
    x: 50,
    y: GAME_CONFIG.CANVAS_HEIGHT / 2,
    velocity: 0,
    radius: GAME_CONFIG.BIRD_SIZE / 2
};

let pipes = [];

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');

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

async function saveScoreToBackend(finalScore) {
    const user = getUserFromParent();
    if (!user || user.id === undefined) {
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
                level: 1, // Flappy bird doesn't strictly have levels, defaulting to 1
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

// Game Logic
function initGame() {
    bird.y = GAME_CONFIG.CANVAS_HEIGHT / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frames = 0;
    updateUI();
}

function update() {
    bird.velocity += GAME_CONFIG.GRAVITY;
    bird.y += bird.velocity;

    // Floor collision
    if (bird.y + bird.radius >= GAME_CONFIG.CANVAS_HEIGHT) {
        endGame();
        return;
    }

    // Ceiling collision
    if (bird.y - bird.radius <= 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }

    // Pipe Logic
    if (frames % GAME_CONFIG.PIPE_SPAWN_RATE === 0) {
        const minHeight = 50;
        const maxHeight = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        pipes.push({
            x: GAME_CONFIG.CANVAS_WIDTH,
            topHeight: topHeight,
            passed: false
        });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.x -= GAME_CONFIG.PIPE_SPEED;

        // Collision Detection
        const inPipeColumn = bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + 50; // Pipe width assumed 50
        const hitTopPipe = bird.y - bird.radius < p.topHeight;
        const hitBottomPipe = bird.y + bird.radius > p.topHeight + GAME_CONFIG.PIPE_GAP;

        if (inPipeColumn && (hitTopPipe || hitBottomPipe)) {
            endGame();
            return;
        }

        // Score update
        if (p.x + 50 < bird.x && !p.passed) {
            score++;
            p.passed = true;
            updateUI();
        }

        // Remove off-screen pipes
        if (p.x + 50 < 0) {
            pipes.splice(i, 1);
        }
    }

    frames++;
}

function draw() {
    // Background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Pipes
    ctx.fillStyle = '#228B22'; // Green
    pipes.forEach(p => {
        // Top Pipe
        ctx.fillRect(p.x, 0, 50, p.topHeight);

        // Bottom Pipe
        ctx.fillRect(p.x, p.topHeight + GAME_CONFIG.PIPE_GAP, 50, GAME_CONFIG.CANVAS_HEIGHT - (p.topHeight + GAME_CONFIG.PIPE_GAP));

        // Pipe outlines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, 0, 50, p.topHeight);
        ctx.strokeRect(p.x, p.topHeight + GAME_CONFIG.PIPE_GAP, 50, GAME_CONFIG.CANVAS_HEIGHT - (p.topHeight + GAME_CONFIG.PIPE_GAP));
    });

    // Bird
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#D2691E'; // Chocolate
    ctx.fillRect(0, GAME_CONFIG.CANVAS_HEIGHT - 10, GAME_CONFIG.CANVAS_WIDTH, 10);
}

function updateUI() {
    scoreEl.textContent = score;
    highScoreEl.textContent = Math.max(score, highScore);
}

function gameLoop() {
    if (gameState !== 'playing') return;

    update();
    draw();

    if (gameState === 'playing') {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    gameState = 'playing';
    startOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    initGame();
    gameLoop();
}

function endGame() {
    gameState = 'gameOver';
    cancelAnimationFrame(animationId);
    finalScoreEl.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
    }
    gameOverOverlay.classList.remove('hidden');
    saveScoreToBackend(score);
}

function jump() {
    if (gameState === 'playing') {
        bird.velocity = GAME_CONFIG.JUMP_STRENGTH;
    }
}

// Event Listeners
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        jump();
    }
});

canvas.addEventListener('mousedown', (e) => {
    jump();
});

// Initial draw
draw();
