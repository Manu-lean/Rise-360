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

export default function TimelineAdmin() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/timeline');
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setMessage('Erreur lors du chargement des événements');
    }
  };

  const handleAddEvent = () => {
    setEvents([...events, { id: Date.now().toString(), date: '', title: '', description: '' }]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleUpdateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (response.ok) {
        setMessage('Événements sauvegardés avec succès !');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde des événements');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionSelect = (version: any) => {
    setEvents(version.data.events);
    setMessage('Version chargée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Administration Timeline</h1>
            <button
              onClick={() => router.push('/games/timeline')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Voir le jeu
            </button>
          </div>

          {message && (
            <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
              {message}
            </div>
          )}

          <VersionManager
            gameType="timeline"
            onVersionSelect={handleVersionSelect}
            currentData={{ events }}
          />

          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Événement {events.findIndex(e => e.id === event.id) + 1}</h3>
                  <button
                    onClick={() => handleRemoveEvent(event.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="text"
                      value={event.date}
                      onChange={(e) => handleUpdateEvent(event.id, 'date', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Titre</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleUpdateEvent(event.id, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={event.description}
                      onChange={(e) => handleUpdateEvent(event.id, 'description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter un événement
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 