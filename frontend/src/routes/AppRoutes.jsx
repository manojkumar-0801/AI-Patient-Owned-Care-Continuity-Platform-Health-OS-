import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import PatientProfile from '../pages/PatientProfile';
import EditProfile from '../pages/EditProfile';
import MedicalRecords from '../pages/MedicalRecords';
import MedicalRecordDetails from '../pages/MedicalRecordDetails';
import AppointmentBooking from '../pages/AppointmentBooking';
import AppointmentHistory from '../pages/AppointmentHistory';
import AppointmentDetails from '../pages/AppointmentDetails';
import MedicalTimeline from '../pages/MedicalTimeline';
import TimelineEventDetails from '../pages/TimelineEventDetails';
import HealthInsights from '../pages/HealthInsights';
import Notifications from '../pages/Notifications';
import Doctors from '../pages/Doctors';
import ProtectedRoute from '../components/ProtectedRoute';
import { Layout } from '../components/layout';

// Doctor Pages
import DoctorProfile from '../pages/doctor/DoctorProfile';
import PatientList from '../pages/doctor/PatientList';
import PatientDetails from '../pages/doctor/PatientDetails';
import MedicalRecordViewer from '../pages/doctor/MedicalRecordViewer';
import DoctorNotes from '../pages/doctor/DoctorNotes';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes - Wrapped in Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/records" element={<MedicalRecords />} />
          <Route path="/records/:id" element={<MedicalRecordDetails />} />
          <Route path="/timeline" element={<MedicalTimeline />} />
          <Route path="/timeline/:id" element={<TimelineEventDetails />} />
          <Route path="/health-insights" element={<HealthInsights />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<AppointmentHistory />} />
          <Route path="/appointments/book" element={<AppointmentBooking />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
        </Route>
      </Route>

      {/* Doctor Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
        <Route element={<Layout />}>
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/patients" element={<PatientList />} />
          <Route path="/doctor/patients/:id" element={<PatientDetails />} />
          <Route path="/doctor/patients/:id/notes" element={<DoctorNotes />} />
          <Route path="/doctor/records/:id" element={<MedicalRecordViewer />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/appointments/:id" element={<AppointmentDetails />} />
        </Route>
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
