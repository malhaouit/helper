import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ConfirmEmail() {
  const { token } = useParams();  // Extract token from the URL
  const [message, setMessage] = useState('');  // For success/error messages
  const navigate = useNavigate();

  useEffect(() => {
    // Function to confirm the email
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/auth/confirm/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Email confirmed successfully! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');  // Redirect to login after 3 seconds
          }, 3000);  // Delay before redirecting
        } else {
          setMessage('Invalid or expired confirmation token.');
        }
      } catch (error) {
        setMessage('An error occurred while confirming your email.');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="confirm-email-container">
      <h1>Email Confirmation</h1>
      <p>{message}</p>
    </div>
  );
}

export default ConfirmEmail;
