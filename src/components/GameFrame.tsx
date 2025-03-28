'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GameFrameProps {
  gameUrl: string;
  title: string;
}

export default function GameFrame({ gameUrl, title }: GameFrameProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'progress') {
        setProgress(event.data.progress);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">{title}</h1>
        <button 
          className="game-button game-button-secondary" 
          onClick={() => router.push('/')}
        >
          Retour à l'accueil
        </button>
      </div>

      <div className="game-content">
        <iframe
          src={gameUrl}
          className="game-iframe"
          title={title}
        />
      </div>

      <div className="game-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 