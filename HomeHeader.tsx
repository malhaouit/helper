import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHeader.css';
import logo from '../../assets/logo.svg';
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';

function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [user, setUser] = useState(null);  // Store the logged-in user data
  const navigate = useNavigate();

  // Check if the user is logged in by retrieving the user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Parse the stored user data
    }
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) {
        const response = await fetch(`http://localhost:7999/api/event/search?q=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
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
    localStorage.removeItem('user');  // Remove user data from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null);  // Clear user state
    navigate('/');  // Redirect to home page
  };

  return (
    <header className="home-header">
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
          onClick={handleSearch} 
        />
        <input
          type="text"
          placeholder="Search events, profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
        {user ? (
          <>
            {/* Display the user's name and a logout option */}
            <span className="user-info">{user.name}</span>
            <span onClick={handleLogout} className="auth-link">Logout</span>
          </>
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
