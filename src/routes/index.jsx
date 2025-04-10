import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import DepartmentsPage from '../pages/Departments';
import Users from '../pages/Users';
import Profile from '../pages/Profile';
import Tasks from '../pages/Tasks';
import Layout from '../components/Layout'; // ✅ Import your layout
import ChangePassword from '../components/ChangePassword';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Wrap protected routes inside Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Principal', 'HOD', 'Faculty']} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          
          {/* Admin only routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
