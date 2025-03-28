'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionManager from '@/components/VersionManager';
import Link from 'next/link';
import TimelineDisplay from '@/components/TimelineDisplay';

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
  const [currentVersionId, setCurrentVersionId] = useState<number | null>(null);
  const [timelineName, setTimelineName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la timeline actuelle
        const timelineResponse = await fetch(`/api/timeline/${params.id}`);
        if (!timelineResponse.ok) {
          throw new Error('Erreur lors de la récupération de la timeline');
        }
        const timelineData = await timelineResponse.json();
        setTimeline(timelineData.data.events || []);
        setTimelineName(timelineData.name || 'Timeline sans nom');

        // Charger les versions de cette timeline spécifique
        const versionsResponse = await fetch(`/api/versions?gameType=timeline&timelineId=${params.id}`);
        if (!versionsResponse.ok) {
          throw new Error('Erreur lors de la récupération des versions');
        }
        const versionsData = await versionsResponse.json();
        
        // Vérifier si versions existe et est un tableau
        if (!versionsData.versions || !Array.isArray(versionsData.versions)) {
          console.log('Aucune version trouvée');
          setVersions([]);
        } else {
          // Filtrer les versions pour ne garder que celles de cette timeline
          const timelineVersions = versionsData.versions.filter((version: any) => 
            version.timeline_id === parseInt(params.id)
          );
          
          // S'assurer que chaque version a la bonne structure
          const formattedVersions = timelineVersions.map((version: any) => ({
            ...version,
            data: {
              events: version.data?.events || []
            }
          }));
          console.log('Versions formatées:', formattedVersions);
          setVersions(formattedVersions);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur détaillée:', err);
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
      setTimeline(data.data?.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleVersionChange = (versionId: number) => {
    setCurrentVersionId(versionId);
    handleLoadVersion(versionId);
  };

  const handleEventsChange = (newEvents: TimelineEvent[]) => {
    setTimeline(newEvents);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Éditer la timeline</h1>
        <Link href={`/games/timeline/${params.id}`} className="game-button game-button-secondary">
          Voir la timeline
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{timelineName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="version-selector">
                <select
                  value={currentVersionId || ''}
                  onChange={(e) => handleVersionChange(Number(e.target.value))}
                  className="form-select"
                >
                  {versions.map((version) => (
                    <option key={version.id} value={version.id}>
                      Version du {new Date(version.created_at).toLocaleDateString()} ({version.data.events.length} événements)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <VersionManager
            timelineId={Number(params.id)}
            onSave={handleSave}
            onEventsChange={handleEventsChange}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Aperçu</h2>
            <TimelineDisplay events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
} 