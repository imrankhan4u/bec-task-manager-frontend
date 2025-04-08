import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl">Task Manager</div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
          <Link to="/departments" className="hover:text-blue-500">Departments</Link>
          <Link to="/tasks" className="hover:text-blue-500">Tasks</Link>
          <Link to="/users" className="hover:text-blue-500">Users</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
