import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHeader.css';
import logo from '../../assets/logo.svg';
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';

function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="home-header">
      <div className="home-header-logo">
        <a href="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </a>
      </div>

      {/* Search Bar */}
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
          <FaHome />
        </a>
        <a href="/about">
          <FaInfoCircle />
        </a>
      </nav>

      {/* Authentication Links */}
      <div className="home-header-auth">
        {user ? (
          <>
            <span className="user-info">{user.name}</span>
            <span onClick={handleLogout} className="auth-link">Logout</span>
          </>
        ) : (
          <>
            <a href="/login" className="auth-link">
              <FaSignInAlt />
            </a>
            <a href="/signup" className="auth-link">
              <FaUserPlus />
            </a>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;

