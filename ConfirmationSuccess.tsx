import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/login'); // Redirect to login after 3 seconds
    }, 3000);
  }, [navigate]);

  return (
    <div className="confirmation-success-container">
      <h1>Email Confirmed!</h1>
      <p>Your email has been confirmed. Redirecting to login...</p>
    </div>
  );
}

export default ConfirmationSuccess;
