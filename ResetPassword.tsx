import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();  // Extract the token from the URL
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),  // Send token and new password
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.msg);  // Show success message
        navigate('/login');  // Redirect to login page
      } else {
        alert('Error resetting password: ' + data.msg);  // Handle error
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
