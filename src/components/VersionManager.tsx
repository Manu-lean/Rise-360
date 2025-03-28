'use client';

import { useState } from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface VersionManagerProps {
  events: TimelineEvent[];
  onSave: (events: TimelineEvent[]) => void;
  onCancel: () => void;
}

export default function VersionManager({ events, onSave, onCancel }: VersionManagerProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(events);

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: '',
      title: '',
      description: ''
    };
    setTimelineEvents([...timelineEvents, newEvent]);
  };

  const handleUpdateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    setTimelineEvents(timelineEvents.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  const handleSave = () => {
    onSave(timelineEvents);
  };

  return (
    <div className="version-manager">
      <div className="events-list">
        {timelineEvents.map((event) => (
          <div key={event.id} className="event-item">
            <div className="event-fields">
              <input
                type="text"
                value={event.date}
                onChange={(e) => handleUpdateEvent(event.id, 'date', e.target.value)}
                placeholder="Date"
                className="event-input"
              />
              <input
                type="text"
                value={event.title}
                onChange={(e) => handleUpdateEvent(event.id, 'title', e.target.value)}
                placeholder="Titre"
                className="event-input"
              />
              <textarea
                value={event.description}
                onChange={(e) => handleUpdateEvent(event.id, 'description', e.target.value)}
                placeholder="Description"
                className="event-textarea"
              />
            </div>
            <button
              onClick={() => handleDeleteEvent(event.id)}
              className="delete-button"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={handleAddEvent} className="add-button">
          Ajouter un événement
        </button>
        <button onClick={handleSave} className="save-button">
          Sauvegarder
        </button>
        <button onClick={onCancel} className="cancel-button">
          Annuler
        </button>
      </div>

      <style jsx>{`
        .version-manager {
          padding: 20px;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }

        .event-item {
          display: flex;
          gap: 10px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .event-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .event-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .event-textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-height: 100px;
        }

        .delete-button {
          padding: 8px 16px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .add-button, .save-button, .cancel-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .add-button {
          background: #4CAF50;
          color: white;
        }

        .save-button {
          background: #2196F3;
          color: white;
        }

        .cancel-button {
          background: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
} 