import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './GameIframe.css';

interface GameIframeProps {
  gameComponent: React.ComponentType<any>;
  gameName: string;
  onScoreSubmit?: (score: number, level?: number) => void;
  userId?: number;
  gameId?: number;
}

/**
 * GameIframe Component
 * 
 * Renders a game component inside an isolated iframe environment.
 * This prevents CSS conflicts and provides a sandboxed environment for games.
 * 
 * Features:
 * - Isolated CSS/JS environment
 * - Message passing between iframe and parent
 * - Score submission to backend
 * - Responsive sizing
 */
const GameIframe: React.FC<GameIframeProps> = ({
  gameComponent: GameComponent,
  gameName,
  onScoreSubmit,
  userId,
  gameId
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Create the iframe HTML structure
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>${gameName}</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  overflow: hidden;
                }
                
                #game-root {
                  width: 100%;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              </style>
            </head>
            <body>
              <div id="game-root"></div>
            </body>
          </html>
        `);
        iframeDoc.close();

        // Wait for iframe to be ready
        setTimeout(() => {
          const gameRoot = iframeDoc.getElementById('game-root');
          if (gameRoot) {
            // Create React root and render the game
            const root = ReactDOM.createRoot(gameRoot);
            
            // Wrap the game component to handle score submissions
            const GameWrapper = () => {
              useEffect(() => {
                // Listen for messages from the game
                const handleMessage = (event: MessageEvent) => {
                  if (event.data.type === 'GAME_SCORE') {
                    const { score, level } = event.data.payload;
                    onScoreSubmit?.(score, level);
                  }
                };

                window.addEventListener('message', handleMessage);
                return () => window.removeEventListener('message', handleMessage);
              }, []);

              return <GameComponent />;
            };

            root.render(<GameWrapper />);
            setIframeReady(true);
          }
        }, 100);

      } catch (error) {
        console.error('Error setting up iframe:', error);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);
    
    // Trigger load if iframe is already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      handleIframeLoad();
    }

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, [GameComponent, gameName, onScoreSubmit]);

  return (
    <div className="game-iframe-container">
      <iframe
        ref={iframeRef}
        className="game-iframe"
        title={gameName}
        sandbox="allow-same-origin allow-scripts"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block'
        }}
      />
      {!iframeReady && (
        <div className="game-loading">
          <div className="game-loading-spinner"></div>
          <p>Loading {gameName}...</p>
        </div>
      )}
    </div>
  );
};

export default GameIframe;
