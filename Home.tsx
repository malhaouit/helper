import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in when the component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Update isLoggedIn based on token presence
  }, []);

  const handleLogout = async () => {
    // Call the backend logout route (optional, as we discussed)
    await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
    });

    // Remove token from localStorage
    localStorage.removeItem('token');

    // Update state and redirect to the login page
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to Online Event Finder</h1>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </div>
  );
}

export default Home;
