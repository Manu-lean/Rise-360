import React from 'react';
import GameCard from './GameCard';

interface Game {
  id: number;
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  created_at: string;
  data?: {
    events?: any[];
  };
}

interface GameGridProps {
  games: Game[];
}

export default function GameGrid({ games }: GameGridProps) {
  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          name={game.name}
          description={game.description}
          type={game.type}
          imageUrl={game.imageUrl}
          createdAt={game.created_at}
          eventCount={game.data?.events?.length}
        />
      ))}
    </div>
  );
} 