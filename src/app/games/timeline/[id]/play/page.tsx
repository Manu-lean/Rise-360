'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export default function TimelinePlayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch(`/api/timeline/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la timeline');
        }
        const data = await response.json();
        setTimeline(data.data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    };

    fetchTimeline();
  }, [params.id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Jouer à la Timeline</h1>
      <div className="timeline">
        {timeline.map((event) => (
          <div key={event.id} className="timeline-event">
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-content">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => router.push(`/games/timeline/${params.id}`)}>
        Retour aux détails
      </button>
    </div>
  );
} 