'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Timeline {
  id: number;
  name: string;
  data: {
    events: TimelineEvent[];
    width?: number;
  };
}

export default function TimelinePlayPage() {
  const params = useParams();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch(`/api/timeline/${params.id}`);
        if (!response.ok) throw new Error('Timeline non trouvée');
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

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!timeline) return <div className="text-center p-8">Timeline non trouvée</div>;

  return (
    <div className="timeline-container" style={{ width: timeline.data.width || 800, margin: '0 auto' }}>
      <style jsx global>{`
        .timeline-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 20px;
          background: #fff;
        }
        .timeline {
          position: relative;
          padding: 40px 0;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e5e7eb;
          transform: translateX(-50%);
        }
        .timeline-event {
          position: relative;
          margin-bottom: 60px;
          width: 50%;
          padding-right: 40px;
          opacity: 0;
          transform: translateX(-20px);
          animation: fadeInLeft 0.5s ease forwards;
        }
        .timeline-event:nth-child(even) {
          margin-left: 50%;
          padding-right: 0;
          padding-left: 40px;
          transform: translateX(20px);
          animation: fadeInRight 0.5s ease forwards;
        }
        .timeline-event::before {
          content: '';
          position: absolute;
          right: -6px;
          top: 0;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        .timeline-event:nth-child(even)::before {
          right: auto;
          left: -6px;
        }
        .timeline-date {
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 8px;
          font-size: 1.1em;
        }
        .timeline-title {
          font-size: 1.3em;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }
        .timeline-description {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1.1em;
        }
        @keyframes fadeInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .timeline-event:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
        .timeline-event:hover::before {
          transform: scale(1.2);
          transition: transform 0.3s ease;
        }
      `}</style>
      <div className="timeline">
        {timeline.data.events.map((event, index) => (
          <div key={event.id} className="timeline-event" style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-title">{event.title}</div>
            <div className="timeline-description">{event.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 