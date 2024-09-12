import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfirmationSuccess() {
  const navigate = useNavigate();

  // Automatically redirect to login after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      navigate('/login');
    }, 3000); // 3-second delay
  }, [navigate]);

  return (
    <div className="confirmation-success-container">
      <h1>Email Confirmation Successful!</h1>
      <p>Your email has been confirmed. You will be redirected to the login page shortly...</p>
    </div>
  );
}

export default ConfirmationSuccess;
