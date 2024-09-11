import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import '../styles/SignUp.css';
import SignUpHeader from '../components/SignUpHeader/SignUpHeader';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // Added confirmPassword state
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Check if the passwords match before sending the request
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:7999/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),  // Sending form data
      });

      const data = await response.json();
      
      // Check if the response status is ok
      if (response.ok) {
        console.log('Sign-up successful', data);
        navigate('/login');  // Redirect to login page after sign-up
      } else {
        console.log('Sign-up failed', data);
        alert(data.msg || 'Sign-up failed');  // Show the error message from backend
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred during sign-up.');
    }
  };

  return (
    <>
      <SignUpHeader />
      <div className="signup-container">
        <GoogleLoginButton />
        <h1 className="signup-title">Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          className="signup-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="signup-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}  // Input for confirming password
        />
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>

        <p className="login-prompt">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
}

export default SignUp;
