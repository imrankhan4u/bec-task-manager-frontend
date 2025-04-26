import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Users = () => {
  const { user } = useAuth();

  // Restrict access to departments for non-Admin users
  if (user.role !== 'Admin') {
    return <Navigate to="/unauthorized" />;
  }

  return <div>Users Content</div>;
};

export default Users;
