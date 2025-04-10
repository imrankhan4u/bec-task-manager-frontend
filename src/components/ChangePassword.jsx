import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setMessage('Password changed successfully. Redirecting to login...');
      
      // Wait 1-2 seconds for UX
      setTimeout(() => {
        logout(); // Clear token/session
        navigate('/login'); // Redirect to login
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword}>
      <div>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Changing...' : 'Change Password'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ChangePassword;
