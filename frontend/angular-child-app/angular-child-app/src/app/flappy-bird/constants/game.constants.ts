export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  
  // Bird properties
  BIRD_WIDTH: 34,
  BIRD_HEIGHT: 24,
  BIRD_X: 50,
  BIRD_START_Y: 250,
  
  // Physics
  GRAVITY: 0.5,
  JUMP_STRENGTH: -8,
  MAX_VELOCITY: 10,
  
  // Pipes
  PIPE_WIDTH: 52,
  PIPE_GAP: 150,
  PIPE_SPEED: 2,
  PIPE_SPACING: 200,
  MIN_PIPE_HEIGHT: 50,
  MAX_PIPE_HEIGHT: 400,
  
  // Game mechanics
  GROUND_HEIGHT: 100,
  SCROLL_SPEED: 2
};

export const COLORS = {
  // Sky gradient
  SKY_TOP: '#4ec0ca',
  SKY_BOTTOM: '#b3e5fc',
  
  // Ground
  GROUND: '#DED895',
  GROUND_STRIPE: '#C9BD6F',
  
  // Pipes
  PIPE_BODY: '#5cb85c',
  PIPE_BORDER: '#4a9a4a',
  PIPE_CAP: '#6cc66c',
  
  // Bird
  BIRD_BODY: '#FFD700',
  BIRD_WING: '#FFA500',
  BIRD_BEAK: '#FF6347',
  BIRD_EYE_WHITE: '#FFFFFF',
  BIRD_EYE_BLACK: '#000000',
  
  // UI
  TEXT_COLOR: '#FFFFFF',
  TEXT_SHADOW: '#000000',
  BUTTON_BG: '#4CAF50',
  BUTTON_HOVER: '#45a049',
  MEDAL_BRONZE: '#CD7F32',
  MEDAL_SILVER: '#C0C0C0',
  MEDAL_GOLD: '#FFD700'
};
