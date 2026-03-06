import React from 'react';
import styled from 'styled-components';

interface FloatingHeartProps {
  x: number;
  y: number;
  id: string;
  onComplete: (id: string) => void;
  size?: 'large' | 'small';
  duration?: number;
}

const HeartContainer = styled.div<{ x: number; y: number; duration: number; size: 'large' | 'small' }>`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  pointer-events: none;
  z-index: ${props => props.size === 'large' ? 100 : 50};
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  animation: floatUp ${props => props.duration}s ease-out forwards;

  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -150px);
    }
  }
`;

const FloatingHeart: React.FC<FloatingHeartProps> = ({ x, y, id, onComplete, size = 'large', duration = 1.5 }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [id, onComplete, duration]);

  const heartSize = size === 'large' ? '40px' : '12px';

  return (
    <HeartContainer x={x} y={y} duration={duration} size={size}>
      <img
        src={`${process.env.PUBLIC_URL}/adultopia/logoHeart.png`}
        alt=""
        style={{
          width: heartSize,
          height: heartSize,
          imageRendering: 'crisp-edges',
        }}
      />
    </HeartContainer>
  );
};

export default FloatingHeart;
