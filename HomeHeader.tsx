import { Link, useNavigate } from 'react-router-dom';
import './HomeHeader.css'; // Import the styles for the HomeHeader
import logo from '../../assets/logo.svg'; // Import your logo file
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';
import { useState } from 'react';

function HomeHeader() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home page after logout
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`); // Redirect to the search results page with the query
    }
  };

  return (
    <header className="home-header">
      {/* Logo image */}
      <div className="home-header-logo">
        <Link to="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="home-header-search">
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          placeholder="Search events, profiles..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </form>

      {/* Navigation Links */}
      <nav className="home-header-nav">
        <Link to="/">
          <div className="nav-icon-text">
            <FaHome />
            <span>Home</span>
          </div>
        </Link>
        <Link to="/about">
          <div className="nav-icon-text">
            <FaInfoCircle />
            <span>About</span>
          </div>
        </Link>
      </nav>

      {/* Authentication Links */}
      <div className="home-header-auth">
        {isLoggedIn ? (
          <span onClick={handleLogout} className="auth-link">Logout</span>
        ) : (
          <>
            <Link to="/login" className="auth-link">
              <div className="nav-icon-text">
                <FaSignInAlt />
                <span>Login</span>
              </div>
            </Link>
            <Link to="/signup" className="auth-link">
              <div className="nav-icon-text">
                <FaUserPlus />
                <span>Sign Up</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
