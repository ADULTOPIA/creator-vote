import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FloatingHeart from './FloatingHeart';

type LoadingProps = {
  message?: React.ReactNode;
  fullScreen?: boolean;
};

const FullScreen = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  z-index: 9999;
  overflow: hidden;
`;

const Inline = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  z-index: 2;
  pointer-events: none;
  user-select: none;
`;

const Message = styled.div`
  margin-top: 6px;
  color: #ffffff;
  text-align: center;
  z-index: 2;
`;

const Loading: React.FC<LoadingProps> = ({ message, fullScreen = true }) => {
  const base = (process.env.PUBLIC_URL || '');
  const LogoSrc = `${base}/adultopia/logoHeart.png`;

  const [hearts, setHearts] = useState<Array<{ id: string; x: number; y: number; size?: 'large' | 'small'; duration?: number }>>([]);
  const intervalRef = useRef<number | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // same behavior as HomePage
  const createFloatingHearts = (x: number, y: number) => {
    const count = 5 + Math.floor(Math.random() * 4); // 5～8個のハート
    const directions = [
      { x: 40, y: -40 },
      { x: -40, y: -40 },
      { x: 10, y: 10 },
      { x: -10, y: 10 },
      { x: 20, y: 0 },
    ];

    const newHearts = Array.from({ length: count }).map((_, i) => {
      const duration = 1 + Math.random() * 0.8; // 1.0～1.8秒

      if (i === 0) {
        return {
          id: `heart-${Date.now()}-${i}`,
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          size: 'small' as const,
          duration,
        };
      }

      const direction = directions[(i - 1) % directions.length];
      const variation = 1 + (Math.random() - 0.5) * 0.4; // 0.8～1.2

      return {
        id: `heart-${Date.now()}-${i}`,
        x: x + direction.x * variation + (Math.random() - 0.5) * 20,
        y: y + direction.y * variation + (Math.random() - 0.5) * 20,
        size: 'small' as const,
        duration,
      };
    });

    setHearts(prev => [...prev, ...newHearts]);
  };

  const addHeartAtCenter = () => {
    const img = logoRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const centerX = Math.round(rect.left + rect.width / 2);
    const centerY = Math.round(rect.top + rect.height / 2);
    createFloatingHearts(centerX, centerY);
  };

  useEffect(() => {
    // start spawning immediately and then every 1s while mounted
    addHeartAtCenter();
    const id = window.setInterval(() => {
      addHeartAtCenter();
    }, 1000);
    intervalRef.current = id;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!fullScreen) {
    return (
      <Inline onMouseDown={(e) => { createFloatingHearts(e.clientX, e.clientY); }} onTouchStart={(e) => { const t = e.touches && e.touches[0]; if (t) createFloatingHearts(t.clientX, t.clientY); }}>
        <Logo ref={logoRef} src={LogoSrc} alt="loading" />
        {message && <Message style={{ marginLeft: 8 }}>{message}</Message>}
        {hearts.map(h => (
          <FloatingHeart key={h.id} id={h.id} x={h.x} y={h.y} onComplete={(id) => setHearts(prev => prev.filter(p => p.id !== id))} size={h.size} duration={h.duration} zIndex={1} />
        ))}
      </Inline>
    );
  }

  return (
    <FullScreen onMouseDown={(e) => { createFloatingHearts(e.clientX, e.clientY); }} onTouchStart={(e) => { const t = e.touches && e.touches[0]; if (t) createFloatingHearts(t.clientX, t.clientY); }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Wrapper>
          <Logo ref={logoRef} src={LogoSrc} alt="loading" />
        </Wrapper>
        {message && <Message>{message}</Message>}
        {hearts.map(h => (
          <FloatingHeart key={h.id} id={h.id} x={h.x} y={h.y} onComplete={(id) => setHearts(prev => prev.filter(p => p.id !== id))} size={h.size} duration={h.duration} zIndex={1} />
        ))}
      </div>
    </FullScreen>
  );
};

export default Loading;
