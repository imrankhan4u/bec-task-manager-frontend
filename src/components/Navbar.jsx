import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ Destructure logout
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    location.pathname === path
      ? 'text-blue-500 font-bold'
      : 'text-gray-700 hover:text-blue-500';

  const handleLogout = () => {
    logout(); // ✅ Call the logout function
    navigate('/login'); // ✅ Redirect to login page
  };

  return (
    <nav className="bg-white shadow-md p-4 flex space-x-6 items-center">
      <Link to="/dashboard" className={linkClass('/dashboard')}>
        Dashboard
      </Link>
      <Link to="/tasks" className={linkClass('/tasks')}>
        Tasks
      </Link>
      <Link to="/profile" className={linkClass('/profile')}>
        Profile
      </Link>
      {user?.role === 'Admin' && (
        <>
          <Link to="/departments" className={linkClass('/departments')}>
            Departments
          </Link>
          <Link to="/users" className={linkClass('/users')}>
            Users
          </Link>
        </>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-700 ml-auto"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
