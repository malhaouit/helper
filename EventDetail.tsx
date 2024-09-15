import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventDetails.css';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity?: number;
  image?: string;
};

function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          setError('No event ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:7999/api/event/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  const formatDate = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };
    return eventDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className="event-details-container">
      {/* Left Side: Event Image and Details */}
      <div className="event-details-left">
        {event.image && (
          <img
            src={`http://localhost:7999/${event.image}`}
            alt={event.title}
            className="event-image"
          />
        )}

        <h1>{event.title}</h1>
        <p className="event-description">{event.description}</p>

        <div className="event-info">
          <div className="event-info-item">
            <label>Date and time</label>
            <p className="event-detail-text">{formatDate(event.date)}</p>
          </div>
          <div className="event-info-item">
            <label>Location</label>
            <p className="event-detail-text">
              {event.location === 'Online' ? 'Online' : event.location}
            </p>
          </div>
        </div>

        <div className="capacity">
          <label>Capacity</label>
          <p className="event-detail-text">{event.capacity} Attendees</p>
        </div>
      </div>

      {/* Right Side: Floating Registration Box */}
      <div className="event-details-right">
        <div className="admission-box">
          <p className="admission-type">General Admission</p>
          <div className="price-box">
            <p className="price">Free</p>
          </div>
          <button className="cta-button">Register for this event</button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
