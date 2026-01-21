import React, { useEffect, useRef } from 'react';
import { userAPI } from '../utils/userApi';
import { useNavigate } from 'react-router-dom';

const GameIframe: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onMessage = async (e: MessageEvent) => {
      const msg = e.data || {};
      console.debug('GameIframe received message:', msg);
      // Play request: attempt to deduct 10 tokens
      if (msg && msg.type === 'game:requestPlay') {
        let user = userAPI.currentUser as any;
        console.debug('Current user at play request:', user);
        // Attempt to hydrate from localStorage if missing
        if ((!user || !user.id) && typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('dawker_session_user');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.id) {
                userAPI.currentUser = parsed;
                user = parsed;
                console.debug('Hydrated userAPI.currentUser from localStorage:', user);
              }
            }
          } catch (e) {
            console.error('Error hydrating user from localStorage', e);
          }
        }
        if (!user || !user.id) {
          // ask iframe to show insufficient tokens and inform user without forcing navigation
          iframeRef.current?.contentWindow?.postMessage({ type: 'game:insufficientTokens' }, '*');
          // Friendly in-app notice instead of navigation
          alert('Please sign in to play — open your Profile to sign in or register.');
          return;
        }

        try {
          await userAPI.createTransaction(user.id, -10, 'PLAY_DEDUCT');
          // allow the game to start
          iframeRef.current?.contentWindow?.postMessage({ type: 'game:playAllowed' }, '*');
        } catch (err) {
          console.error('Error deducting tokens:', err);
          // if error, inform iframe that tokens are insufficient
          iframeRef.current?.contentWindow?.postMessage({ type: 'game:insufficientTokens' }, '*');
        }
      }

      // Level passed: award 5 tokens
      if (msg && msg.type === 'game:levelPassed') {
        const level = msg.level as number | undefined;
        const user = userAPI.currentUser as any;
        console.debug('Level passed message, user:', user, 'level:', level);
        if (!user || !user.id) return;
        try {
          await userAPI.createTransaction(user.id, 5, `LEVEL_REWARD:${level ?? 'unknown'}`);
        } catch (err) {
          console.error('Failed to award tokens', err);
        }
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        src="/game/index.html"
        title="The Impossible - Mini Clone"
        style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default GameIframe;
