import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventDetails.css';

function EventDetails() {
  // Extract the eventId from the URL parameters
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);  // State to hold the event data
  const [loading, setLoading] = useState(true);  // State for loading status
  const [error, setError] = useState('');  // State for handling errors

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
        setLoading(false);  // Stop loading after data is fetched
      } catch (err) {
        setError(err.message);
        setLoading(false);  // Stop loading if there was an error
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Show loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display an error message if any
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Display the event details
  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <div className="event-info">
        <div>
          <label>Date:</label> {new Date(event.date).toLocaleDateString()}
        </div>
        <div>
          <label>Time:</label> {new Date(event.date).toLocaleTimeString()}
        </div>
        <div>
          <label>Location:</label> {event.location}
        </div>
      </div>

      <div className="capacity">
        <label>Capacity:</label> {event.capacity}
      </div>

      {/* Add a button or other features */}
      <button className="cta-button">Register for this event</button>
    </div>
  );
}

export default EventDetails;