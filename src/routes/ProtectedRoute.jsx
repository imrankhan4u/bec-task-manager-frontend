import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader'; // ✅ Add this

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />; // ✅ Show loader while checking auth
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log('user we recieved '+user.name+' '+user.role+' allowed user role '+allowedRoles);

  const userBaseRole = user.role.includes('-') ? user.role.split('-')[0] : user.role;

  if (!allowedRoles.includes(userBaseRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  

  return <Outlet />;
};

export default ProtectedRoute;
