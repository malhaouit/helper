// src/pages/ConfirmEmail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ConfirmEmail.css'; // You can style the page accordingly

function ConfirmEmail() {
  const { token } = useParams();  // Get the token from the URL
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/auth/confirm/${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Email confirmed successfully! You can now log in.');
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after a short delay
          }, 3000);
        } else {
          setMessage(data.msg || 'Confirmation failed. The token might have expired.');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setMessage('An error occurred. Please try again later.');
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
