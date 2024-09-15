/* Main container with left and right sections */
.event-details-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 50px auto;
  position: relative;
  gap: 20px;
  flex-wrap: wrap; /* Allow wrapping for smaller screens */
}

/* Left side for event details */
.event-details-left {
  flex: 2;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
  position: relative;
}

/* Event image styling (full width at the top) */
.event-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
}

/* Event title styling */
.event-details-left h1 {
  font-size: 2.8em;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #12cb44;
  padding-bottom: 10px;
}

/* Event description */
.event-description {
  font-size: 1.2em;
  line-height: 1.8;
  margin: 20px 0;
}

/* Date and Location styling */
.event-info {
  margin-top: 30px;
}

.event-info-item {
  margin-bottom: 20px;
}

.event-info label {
  font-size: 1.3em;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
}

.event-detail-text {
  font-size: 1.2em;
  color: black;
  margin-top: 5px;
}

/* Capacity styling */
.capacity {
  margin-top: 30px;
}

.capacity label {
  font-size: 1.3em;
  font-weight: bold;
  color: black;
}

.capacity .event-detail-text {
  font-size: 1.2em;
  color: black;
}

/* Right-hand floating registration box */
.event-details-right {
  flex: 1;
  margin-left: 20px; /* Ensures some space between the box and event details */
  max-width: 300px;
}

.admission-box {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
  text-align: left;
  position: sticky;
  top: 20px; /* Sticky positioning */
}

.admission-type {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 15px;
}

.price-box {
  margin-bottom: 20px;
}

.price {
  font-size: 2em;
  font-weight: bold;
  color: #12cb44;
}

/* Register button */
.cta-button {
  width: 100%;
  padding: 15px;
  background-color: #12cb44;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  text-align: center;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #0fa233;
}

/* Responsive design */
@media (max-width: 768px) {
  .event-details-container {
    flex-direction: column;
    gap: 0;
  }

  .event-details-right {
    margin-top: 20px;
    max-width: 100%;
  }
}
