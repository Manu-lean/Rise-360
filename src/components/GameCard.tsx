import React from 'react';
import { useRouter } from 'next/navigation';

interface GameCardProps {
  id: number;
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  createdAt: string;
  eventCount?: number;
}

export default function GameCard({ id, name, description, type, imageUrl, createdAt, eventCount }: GameCardProps) {
  const router = useRouter();

  return (
    <div className="game-card">
      {imageUrl && (
        <div className="game-card-image">
          <img src={imageUrl} alt={name} />
        </div>
      )}
      <div className="game-card-content">
        <h2 className="game-card-title">{name}</h2>
        <p className="game-card-description">{description}</p>
        <div className="game-card-meta">
          <span className="game-card-type">{type}</span>
          <span className="game-card-date">
            Créé le {new Date(createdAt).toLocaleDateString()}
          </span>
          {eventCount !== undefined && (
            <span className="game-card-count">
              {eventCount} événement{eventCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="game-card-actions">
          <button 
            className="game-button game-button-primary"
            onClick={() => router.push(`/games/${type}/${id}`)}
          >
            Voir
          </button>
          <button 
            className="game-button game-button-secondary"
            onClick={() => router.push(`/games/${type}/${id}/edit`)}
          >
            Éditer
          </button>
        </div>
      </div>
    </div>
  );
} 