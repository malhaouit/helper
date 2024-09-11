import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import '../styles/SignUp.css';
import SignUpHeader from '../components/SignUpHeader/SignUpHeader';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // New state for confirmation
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Check if the passwords match before sending the request
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const response = await fetch('http://localhost:7999/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.token) {
      console.log('Sign-up successful');
      navigate('/login');  // Redirect to login page after sign-up
    } else {
      alert('Sign-up failed');
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
          onChange={(e) => setConfirmPassword(e.target.value)}  // Handle confirm password input
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
