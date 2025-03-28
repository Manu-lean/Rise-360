'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Timeline {
  id: number;
  name: string;
  created_at: string;
  data: {
    events: Array<{
      id: string;
      date: string;
      title: string;
      description: string;
    }>;
  };
}

export default function TimelinePage() {
  const router = useRouter();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimelines();
  }, []);

  const loadTimelines = async () => {
    try {
      const response = await fetch('/api/timeline');
      const data = await response.json();
      
      // Parser les données JSON pour chaque timeline
      const parsedTimelines = data.timelines.map((timeline: any) => ({
        ...timeline,
        data: JSON.parse(timeline.data)
      }));
      
      setTimelines(parsedTimelines);
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des timelines');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="game-container">
        <h1 className="game-title">Chargement...</h1>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Timelines</h1>
      
      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      <div className="game-controls">
        <button 
          className="game-button game-button-primary"
          onClick={() => router.push('/games/timeline/edit')}
        >
          Créer une nouvelle timeline
        </button>
        <button 
          className="game-button game-button-secondary" 
          onClick={() => router.push('/')}
        >
          Retour à l'accueil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {timelines.map((timeline) => (
          <div key={timeline.id} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{timeline.name}</h2>
            <p className="text-gray-600 mb-4">
              Créée le {new Date(timeline.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-4">
              {timeline.data.events.length} événements
            </p>
            <div className="flex gap-4">
              <button
                className="game-button game-button-primary"
                onClick={() => router.push(`/games/timeline/${timeline.id}`)}
              >
                Voir
              </button>
              <button
                className="game-button game-button-secondary"
                onClick={() => router.push(`/games/timeline/${timeline.id}/edit`)}
              >
                Éditer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 