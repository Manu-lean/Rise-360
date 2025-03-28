'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameGrid from '@/components/GameGrid';
import NewGameForm from '@/components/NewGameForm';

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

export default function Home() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewGameForm, setShowNewGameForm] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des jeux');
        }
        const data = await response.json();
        setGames(data.games);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="message message-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Jeux</h1>
        {!showNewGameForm && (
          <button
            onClick={() => setShowNewGameForm(true)}
            className="game-button game-button-primary"
          >
            Créer un nouveau jeu
          </button>
        )}
      </div>

      {showNewGameForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Créer un nouveau jeu</h2>
          <NewGameForm onCancel={() => setShowNewGameForm(false)} />
        </div>
      ) : null}

      {games.length === 0 ? (
        <div className="message message-info">
          Aucun jeu disponible. Créez votre premier jeu !
        </div>
      ) : (
        <GameGrid games={games} />
      )}
    </div>
  );
} 