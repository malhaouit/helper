import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import '../styles/SignUp.css';
import SignUpHeader from '../components/SignUpHeader/SignUpHeader';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:7999/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Alert the user about the confirmation email
      alert('A confirmation link has been sent to your email.');

      // Clear the input fields after successful registration
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Optionally, redirect the user to another page after sign-up
      navigate('/login');
    } else {
      alert(data.msg || 'Sign-up failed');
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
          onChange={(e) => setConfirmPassword(e.target.value)}
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

