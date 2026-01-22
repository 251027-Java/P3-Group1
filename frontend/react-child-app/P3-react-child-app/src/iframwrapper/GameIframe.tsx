import React, { useRef, useState, useEffect } from 'react';

type GameIframeProps = {
  src?: string;
  initialLevel?: number;
  allowFullscreen?: boolean;
  className?: string;
};

const GameIframe: React.FC<GameIframeProps> = ({ src = '/game/index.html', initialLevel = 1, allowFullscreen = false, className }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derive a safe target origin from the src; fall back to '*' if parsing fails
  const targetOrigin = (() => {
    try {
      return new URL(src, window.location.href).origin;
    } catch (e) {
      return '*';
    }
  })();

  useEffect(() => {
    const handleMessage = (ev: MessageEvent) => {
      if (targetOrigin !== '*' && ev.origin !== targetOrigin) return;
      const data = ev.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'game:ready':
          setReady(true);
          // ensure the iframe has initial level
          iframeRef.current?.contentWindow?.postMessage({ type: 'game:setLevel', level: selectedLevel }, targetOrigin);
          break;
        case 'game:loaded':
          setLoading(false);
          break;
        case 'game:error':
          setError(typeof data.message === 'string' ? data.message : 'Game reported an error');
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [targetOrigin, selectedLevel]);

  useEffect(() => {
    if (ready) {
      iframeRef.current?.contentWindow?.postMessage({ type: 'game:setLevel', level: selectedLevel }, targetOrigin);
    }
  }, [selectedLevel, ready, targetOrigin]);

  const onLoad = () => {
    // Treat iframe load as a fallback signal in case the embedded game doesn't emit ready/loaded messages.
    setLoading(false);
    setReady(true);
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: 'host:init' }, targetOrigin);
      // ensure initial level is applied immediately on load
      iframeRef.current?.contentWindow?.postMessage({ type: 'game:setLevel', level: selectedLevel }, targetOrigin);
    } catch (e) {
      // ignore
    }
  };

  const handlePlay = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'game:start' }, targetOrigin);
  };

  const sandboxAttrs = `allow-scripts allow-forms${allowFullscreen ? ' allow-top-navigation-by-user-activation' : ''}`;

  return (
    <div className={className} style={{ width: '100%', height: 'calc(100vh - 72px)', background: '#0b0b0b', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#111217', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ color: '#fff', fontWeight: 700 }}>The Impossible — Demo</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSelectedLevel(1)}
              className={`px-3 py-1 rounded ${selectedLevel === 1 ? 'bg-green-600' : 'bg-white/10'}`}>
              L1
            </button>
            <button
              onClick={() => setSelectedLevel(2)}
              className={`px-3 py-1 rounded ${selectedLevel === 2 ? 'bg-yellow-600' : 'bg-white/10'}`}>
              L2
            </button>
            <button
              onClick={() => setSelectedLevel(3)}
              className={`px-3 py-1 rounded ${selectedLevel === 3 ? 'bg-red-600' : 'bg-white/10'}`}>
              L3
            </button>
          </div>
          <button onClick={handlePlay} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>▶ Play</button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, background: 'linear-gradient(90deg, rgba(11,11,11,0.6), rgba(17,18,23,0.6))' }}>
            <div style={{ color: '#fff' }}>Loading game…</div>
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 6, background: 'rgba(220,38,38,0.9)', color: '#fff', padding: '8px 12px', borderRadius: 6 }}>
            {error}
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          title="The Impossible - Mini Clone"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          sandbox={sandboxAttrs}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
};

export default GameIframe;
