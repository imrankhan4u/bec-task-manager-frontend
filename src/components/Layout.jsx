import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const userBaseRole = user.role.includes('-') ? user.role.split('-')[0] : user.role;

  // Utility function for active link styling
  const linkClass = (path) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold bg-blue-50 rounded px-2 py-1'
      : 'text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded px-2 py-1 transition';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          {/* App Name */}
          <div className="p-4 font-bold text-2xl text-blue-600 border-b border-gray-200">
            Task Manager
          </div>

          {/* User Role */}
          <div className="p-4 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
            Role: <span className="font-medium text-gray-700">{userBaseRole}</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col p-4 space-y-1 text-[15px]">
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            <Link to="/tasks" className={linkClass('/tasks')}>Tasks</Link>
            <Link to="/profile" className={linkClass('/profile')}>Profile</Link>

            {userBaseRole === 'Admin' && (
              <>
                <Link to="/departments" className={linkClass('/departments')}>Departments</Link>
                <Link to="/users" className={linkClass('/users')}>Users</Link>
              </>
            )}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
