import React from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface TimelineDisplayProps {
  events: TimelineEvent[];
}

export default function TimelineDisplay({ events }: TimelineDisplayProps) {
  return (
    <div className="timeline-container">
      {events.map((event, index) => (
        <div key={event.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
          <div className="timeline-content">
            <div className="timeline-info">
              <div className="timeline-date">{event.date}</div>
              <h3 className="timeline-title">{event.title}</h3>
              <div className="timeline-description">{event.description}</div>
            </div>
            
            {(event.imageUrl || event.videoUrl) && (
              <div className="timeline-media">
                {event.videoUrl ? (
                  <div className="timeline-video">
                    <div className="youtube" data-embed={event.videoUrl.split('v=')[1]}>
                      <div className="play-button"></div>
                      <img 
                        src={`https://img.youtube.com/vi/${event.videoUrl.split('v=')[1]}/maxresdefault.jpg`} 
                        alt={event.title}
                      />
                    </div>
                  </div>
                ) : event.imageUrl && (
                  <div className="timeline-image">
                    <img src={event.imageUrl} alt={event.title} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 