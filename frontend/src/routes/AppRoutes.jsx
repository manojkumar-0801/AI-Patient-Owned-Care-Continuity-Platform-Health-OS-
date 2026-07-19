import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PatientProfile from '../pages/PatientProfile';
import EditProfile from '../pages/EditProfile';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
            <p>Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
}
