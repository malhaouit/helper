import { useState } from 'react';

function SearchEvents() {
  const [query, setQuery] = useState('');  // State to hold the search query
  const [results, setResults] = useState([]);  // State to hold search results
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7999/api/event/search?query=${query}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);  // Set search results
        setError('');  // Clear error
      } else {
        setResults([]);  // Clear results if no match
        setError(data.msg || 'No events found');  // Show error message
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error occurred during the search');
    }
  };

  return (
    <div>
      <h1>Search for Events</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, description, or location"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {results.length > 0 ? (
          <ul>
            {results.map((event) => (
              <li key={event._id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()} - {event.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          error === '' && <p>No events found</p>
        )}
      </div>
    </div>
  );
}

export default SearchEvents;
