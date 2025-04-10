// import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (!user) return null;

//   const userBaseRole = user.role.includes('-') ? user.role.split('-')[0] : user.role;

//   // Utility function for active link styling
//   const linkClass = (path) =>
//     location.pathname === path
//       ? 'text-blue-600 font-semibold bg-blue-50 rounded px-2 py-1'
//       : 'text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded px-2 py-1 transition';

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
//         <div>
//           {/* App Name */}
//           <div className="p-4 font-bold text-2xl text-blue-600 border-b border-gray-200">
//             Task Manager
//           </div>

//           {/* User Role */}
//           <div className="p-4 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
//             Role: <span className="font-medium text-gray-700">{userBaseRole}</span>
//           </div>

//           {/* Navigation */}
//           <nav className="flex flex-col p-4 space-y-1 text-[15px]">
//             <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
//             <Link to="/tasks" className={linkClass('/tasks')}>Tasks</Link>
//             <Link to="/profile" className={linkClass('/profile')}>Profile</Link>

//             {userBaseRole === 'Admin' && (
//               <>
//                 <Link to="/departments" className={linkClass('/departments')}>Departments</Link>
//                 <Link to="/users" className={linkClass('/users')}>Users</Link>
//               </>
//             )}
//           </nav>
//         </div>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userBaseRole = user.role.includes('-') ? user.role.split('-')[0] : user.role;

  // Active link style
  const linkStyle = (path) => ({
    display: 'block',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: location.pathname === path ? '#2563EB' : '#374151',
    backgroundColor: location.pathname === path ? '#EFF6FF' : 'transparent',
    fontWeight: location.pathname === path ? '600' : 'normal',
    fontSize: '15px',
    transition: 'all 0.3s',
    marginBottom: '4px',
  });

  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F3F4F6',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  };

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const headerStyle = {
    padding: '16px',
    fontWeight: 'bold',
    fontSize: '22px',
    color: '#2563EB',
    borderBottom: '1px solid #E5E7EB',
  };

  const roleStyle = {
    padding: '16px',
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#6B7280',
    borderBottom: '1px solid #E5E7EB',
  };

  const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: '24px',
  };

  const logoutButtonStyle = {
    margin: '16px',
    padding: '10px',
    backgroundColor: '#EF4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div>
          <div style={headerStyle}>Task Manager</div>

          <div style={roleStyle}>
            Role: <span style={{ fontWeight: '500', color: '#374151' }}>{userBaseRole}</span>
          </div>

          <nav style={navStyle}>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
            <Link to="/tasks" style={linkStyle('/tasks')}>Tasks</Link>
            <Link to="/profile" style={linkStyle('/profile')}>Profile</Link>

            {user?.role === 'Admin' && (
              <>
                <Link to="/departments" style={linkStyle('/departments')}>Departments</Link>
                <Link to="/users" style={linkStyle('/users')}>Users</Link>
              </>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#DC2626')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#EF4444')}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <Outlet />
      </main>
    </div>
  );
}
