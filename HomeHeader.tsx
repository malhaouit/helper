import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHeader.css'; // Import the styles for the HomeHeader
import logo from '../../assets/logo.svg'; // Import your logo file
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';

function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  // Fetch matching events as the user types
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) { // Only search after 3 characters
        const response = await fetch(`http://localhost:7999/api/event/search?q=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]); // Clear results when query is too short
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="home-header">
      {/* Logo image */}
      <div className="home-header-logo">
        <a href="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </a>
      </div>

      {/* Search Bar with Icon */}
      <div className="home-header-search">
        <img
          src={searchIcon}
          alt="Search Icon"
          className="search-icon"
          onClick={handleSearch} // Trigger search when clicking the icon
        />
        <input
          type="text"
          placeholder="Search events, profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Set search query
          className="search-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter
        />
        {searchResults.length > 0 && (
          <ul className="search-dropdown">
            {searchResults.map((event) => (
              <li key={event._id} onClick={() => handleEventClick(event._id)}>
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="home-header-nav">
        <a href="/">
          <div className="nav-icon-text">
            <FaHome />
            <span>Home</span>
          </div>
        </a>
        <a href="/about">
          <div className="nav-icon-text">
            <FaInfoCircle />
            <span>About</span>
          </div>
        </a>
      </nav>

      {/* Authentication Links */}
      <div className="home-header-auth">
        {isLoggedIn ? (
          <span onClick={handleLogout} className="auth-link">Logout</span>
        ) : (
          <>
            <a href="/login" className="auth-link">
              <div className="nav-icon-text">
                <FaSignInAlt />
                <span>Login</span>
              </div>
            </a>
            <a href="/signup" className="auth-link">
              <div className="nav-icon-text">
                <FaUserPlus />
                <span>Sign Up</span>
              </div>
            </a>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
