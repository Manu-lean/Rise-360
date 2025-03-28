'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface Timeline {
  id: number;
  name: string;
  created_at: string;
  data: {
    events: TimelineEvent[];
  };
}

export default function TimelineDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch(`/api/timeline/${params.id}`);
        if (!response.ok) {
          throw new Error('Timeline non trouvée');
        }
        const data = await response.json();
        setTimeline(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [params.id]);

  if (loading) {
    return (
      <div className="game-container">
        <h1 className="game-title">Chargement...</h1>
      </div>
    );
  }

  if (error || !timeline) {
    return (
      <div className="game-container">
        <h1 className="game-title">Erreur</h1>
        <p className="text-red-500">{error || 'Timeline non trouvée'}</p>
        <button 
          className="game-button game-button-secondary mt-4"
          onClick={() => router.push('/games/timeline')}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">{timeline.name}</h1>
        <div className="game-controls">
          <button 
            className="game-button game-button-primary"
            onClick={() => router.push(`/games/timeline/${timeline.id}/play`)}
          >
            Jouer
          </button>
          <button 
            className="game-button game-button-secondary"
            onClick={() => router.push(`/games/timeline/${timeline.id}/edit`)}
          >
            Éditer
          </button>
          <button 
            className="game-button game-button-secondary"
            onClick={() => router.push('/games/timeline')}
          >
            Retour à la liste
          </button>
        </div>
      </div>

      <div className="timeline-info">
        <p className="text-gray-600">
          Créée le {new Date(timeline.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          {timeline.data.events.length} événements
        </p>
      </div>

      <div className="timeline-preview">
        <h2 className="text-xl font-semibold mb-4">Aperçu des événements</h2>
        <div className="space-y-4">
          {timeline.data.events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.date}</p>
              <p className="mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 