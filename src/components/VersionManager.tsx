'use client';

import React, { useState, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface Version {
  id: number;
  name: string;
  data: {
    events: TimelineEvent[];
  };
  created_at: string;
}

interface VersionManagerProps {
  timelineId: number;
  onSave: (events: TimelineEvent[]) => Promise<void>;
  onEventsChange: (events: TimelineEvent[]) => void;
}

export default function VersionManager({ timelineId, onSave, onEventsChange }: VersionManagerProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [timelineId]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/versions?gameType=timeline&timelineId=${timelineId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des versions');
      }
      const data = await response.json();
      if (data.versions && Array.isArray(data.versions)) {
        setVersions(data.versions);
        if (data.versions.length > 0) {
          setEvents(data.versions[0].data.events);
          setSelectedVersion(data.versions[0].id);
          onEventsChange(data.versions[0].data.events);
        }
      } else {
        setVersions([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des versions:', err);
      setError('Erreur lors de la récupération des versions');
    }
  };

  const handleVersionChange = (versionId: number) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setEvents(version.data.events);
      setSelectedVersion(versionId);
      onEventsChange(version.data.events);
      setIsEditing(false);
    }
  };

  const handleAddEvent = () => {
    const newEvents = [...events, {
      id: Date.now().toString(),
      date: '',
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: ''
    }];
    setEvents(newEvents);
    onEventsChange(newEvents);
    setIsEditing(true);
  };

  const handleUpdateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    );
    setEvents(updatedEvents);
    onEventsChange(updatedEvents);
    setIsEditing(true);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    onEventsChange(updatedEvents);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onSave(events);
      setSuccess('Événements sauvegardés avec succès');
      setIsEditing(false);
      fetchVersions();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde des événements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const currentVersion = versions.find(v => v.id === selectedVersion);
    if (currentVersion) {
      setEvents(currentVersion.data.events);
      onEventsChange(currentVersion.data.events);
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="version-manager">
      <div className="events-list">
        {events.map((event, index) => (
          <div key={event.id} className="event-item">
            <div className="event-header">
              <h3>Événement {index + 1}</h3>
              {isEditing && (
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="delete-button"
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-input"
                value={event.date}
                onChange={(e) => handleUpdateEvent(event.id, 'date', e.target.value)}
                placeholder="Date de l'événement"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Titre</label>
              <input
                type="text"
                className="form-input"
                value={event.title}
                onChange={(e) => handleUpdateEvent(event.id, 'title', e.target.value)}
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={event.description}
                onChange={(e) => handleUpdateEvent(event.id, 'description', e.target.value)}
                placeholder="Description de l'événement"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-input"
                value={event.imageUrl || ''}
                onChange={(e) => handleUpdateEvent(event.id, 'imageUrl', e.target.value)}
                placeholder="URL de l'image"
              />
              {event.imageUrl && (
                <div className="image-preview">
                  <img src={event.imageUrl} alt="Aperçu" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Vidéo YouTube URL</label>
              <input
                type="text"
                className="form-input"
                value={event.videoUrl || ''}
                onChange={(e) => handleUpdateEvent(event.id, 'videoUrl', e.target.value)}
                placeholder="URL de la vidéo YouTube"
              />
              {event.videoUrl && (
                <div className="video-preview">
                  <div className="youtube" data-embed={event.videoUrl.split('v=')[1]}>
                    <div className="play-button"></div>
                    <img 
                      src={`https://img.youtube.com/vi/${event.videoUrl.split('v=')[1]}/maxresdefault.jpg`} 
                      alt="Aperçu vidéo"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing ? (
        <div className="event-form">
          <h3>Ajouter un événement</h3>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="text"
              className="form-input"
              value={events[events.length - 1].date}
              onChange={(e) => handleUpdateEvent(events[events.length - 1].id, 'date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input
              type="text"
              className="form-input"
              value={events[events.length - 1].title}
              onChange={(e) => handleUpdateEvent(events[events.length - 1].id, 'title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={events[events.length - 1].description}
              onChange={(e) => handleUpdateEvent(events[events.length - 1].id, 'description', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-input"
              value={events[events.length - 1].imageUrl || ''}
              onChange={(e) => handleUpdateEvent(events[events.length - 1].id, 'imageUrl', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vidéo YouTube URL</label>
            <input
              type="text"
              className="form-input"
              value={events[events.length - 1].videoUrl || ''}
              onChange={(e) => handleUpdateEvent(events[events.length - 1].id, 'videoUrl', e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            className="game-button game-button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddEvent}
          className="game-button game-button-primary"
        >
          Ajouter un événement
        </button>
      )}

      {error && <div className="message message-error">{error}</div>}
      {success && <div className="message message-success">{success}</div>}
    </div>
  );
} 