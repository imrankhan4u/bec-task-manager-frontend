import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import DepartmentsPage from "../pages/Departments";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import Tasks from "../pages/Tasks";
import Layout from "../components/Layout";
import ChangePassword from "../components/ChangePassword";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Combined Protected Route for both Admin and Principal/HOD/Faculty */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "Principal", "HOD", "Faculty"]}
          />
        }
      >
        <Route element={<Layout />}>
          {/* Dashboard is common for both Admin and Principal/HOD/Faculty */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Tasks route is available for Principal, HOD, Faculty only */}
          <Route path="/tasks" element={<Tasks />} />

          {/* Admin only routes */}
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/users" element={<Users />} />

          {/* Profile and Change Password are available for all roles */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
