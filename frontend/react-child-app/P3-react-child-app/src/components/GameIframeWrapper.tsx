import React from 'react';

interface GameIframeWrapperProps {
    game: string;
}

const GameIframeWrapper: React.FC<GameIframeWrapperProps> = ({ game }) => {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
            <iframe
                src={`/games/${game}/index.html`}
                title={game}
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-same-origin allow-scripts allow-forms"
            />
        </div>
    );
};

export default GameIframeWrapper;
