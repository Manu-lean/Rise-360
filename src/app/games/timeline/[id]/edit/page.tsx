'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionManager from '@/components/VersionManager';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface Version {
  id: number;
  name: string;
  created_at: string;
  data: {
    events: TimelineEvent[];
  };
}

export default function TimelineEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la timeline actuelle
        const timelineResponse = await fetch(`/api/timeline/${params.id}`);
        if (!timelineResponse.ok) {
          throw new Error('Erreur lors de la récupération de la timeline');
        }
        const timelineData = await timelineResponse.json();
        setTimeline(timelineData.data.events);

        // Charger les versions
        const versionsResponse = await fetch('/api/versions?gameType=timeline');
        const versionsData = await versionsResponse.json();
        setVersions(versionsData.versions);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSave = async (events: TimelineEvent[]) => {
    try {
      const response = await fetch(`/api/timeline/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      router.push(`/games/timeline/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteVersion = async (versionId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette version ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/versions/${versionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVersions(versions.filter(v => v.id !== versionId));
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleLoadVersion = async (versionId: number) => {
    try {
      const response = await fetch(`/api/versions/${versionId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la version');
      }
      const data = await response.json();
      setTimeline(data.data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

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

  return (
    <div className="game-container">
      <h1 className="game-title">Éditer la Timeline</h1>

      <div className="game-controls mb-8">
        <button 
          className="game-button game-button-secondary" 
          onClick={() => router.push(`/games/timeline/${params.id}`)}
        >
          Retour aux détails
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Versions disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <div key={version.id} className="border p-4 rounded">
              <h3 className="font-medium">{version.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Créée le {new Date(version.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {version.data.events.length} événements
              </p>
              <div className="flex gap-2">
                <button
                  className="game-button game-button-primary"
                  onClick={() => handleLoadVersion(version.id)}
                >
                  Charger
                </button>
                <button
                  className="game-button game-button-danger"
                  onClick={() => handleDeleteVersion(version.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VersionManager
        events={timeline}
        onSave={handleSave}
        onCancel={() => router.push(`/games/timeline/${params.id}`)}
      />
    </div>
  );
} 