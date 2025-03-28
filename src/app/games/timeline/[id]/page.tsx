'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TimelineDisplay from '@/components/TimelineDisplay';
import Script from 'next/script';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface Timeline {
  id: number;
  name: string;
  created_at: string;
  data: {
    events: TimelineEvent[];
  };
}

export default function TimelinePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch(`/api/timeline/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la timeline');
        }
        const data = await response.json();
        setTimeline(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
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

  if (error) {
    return (
      <div className="game-container">
        <div className="message message-error">{error}</div>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="game-container">
        <div className="message message-error">Timeline non trouvée</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-controls mb-8">
        <button 
          className="game-button game-button-secondary" 
          onClick={() => router.push('/games/timeline')}
        >
          Retour à la liste
        </button>
        <button 
          className="game-button game-button-primary ml-4" 
          onClick={() => router.push(`/games/timeline/${params.id}/edit`)}
        >
          Éditer
        </button>
      </div>

      <h1 className="game-title mb-8">{timeline.name}</h1>
      
      <TimelineDisplay events={timeline.data.events} />
      
      <Script src="/js/youtube-player.js" strategy="afterInteractive" />
    </div>
  );
} 