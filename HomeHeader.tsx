import { Link, useNavigate } from 'react-router-dom';
import './HomeHeader.css'; // Import the styles for the HomeHeader

function HomeHeader() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <header className="home-header">
      <div className="home-header-logo">
        <Link to="/">EventFinder</Link> {/* Replace with actual logo or brand name */}
      </div>

      <nav className="home-header-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/events">Events</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="home-header-auth">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="home-header-logout">Logout</button>
        ) : (
          <>
            <Link to="/login">
              <button className="home-header-login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="home-header-signup">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
