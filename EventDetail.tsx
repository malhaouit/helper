import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventDetails.css';

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await fetch(`http://localhost:7999/api/event/${eventId}`);
      const data = await response.json();
      setEvent(data);
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <div className="event-info">
        <div>
          <label>Date:</label> {new Date(event.date).toLocaleDateString()}
        </div>
        <div>
          <label>Location:</label> {event.location}
        </div>
      </div>

      <div className="capacity">
        <label>Capacity:</label> {event.capacity}
      </div>

      {/* If you want a call-to-action button */}
      <button className="cta-button">Register for this event</button>
    </div>
  );
}

export default EventDetails;
