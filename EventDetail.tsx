import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/event/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Error fetching event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-detail-container">
      <h1>{event.title}</h1>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Organizer:</strong> {event.organizer.name}</p>
      <p>{event.description}</p>
    </div>
  );
}

export default EventDetail;
