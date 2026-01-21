// GameContainer.tsx - DEPRECATED
// This component is no longer used as we've switched to iframe-based game integration
// The React native game components (BubbleTrouble, FlappyBird) have been removed
// Games are now served from public/games/ and loaded via GameIframeWrapper

/*
import React, { useState, useEffect } from 'react';
import { BubbleTrouble } from '../games/bubble-trouble';
import { FlappyBird } from '../games/flappy-bird';
import gameService from '../services/gameService';
import './GameContainer.css';

... rest of the component code ...
*/

export default function GameContainer() {
  return <div>GameContainer is deprecated. Use GameIframeWrapper instead.</div>;
}
