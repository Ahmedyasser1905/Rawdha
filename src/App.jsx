import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import AdminManageStudents from './pages/AdminManageStudents';
import AdminManageGroups from './pages/AdminManageGroups';
import AdminGroupDetails from './pages/AdminGroupDetails';
import AdminApprovePayments from './pages/AdminApprovePayments';
import AdminMessages from './pages/AdminMessages';
import AdminRegistrationRequests from './pages/AdminRegistrationRequests';
import AdminFinance from './pages/AdminFinance';
import AdminReports from './pages/AdminReports';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherReports from './pages/TeacherReports';
import ParentDashboard from './pages/ParentDashboard';
import ParentPortalHome from './pages/ParentPortalHome';
import ParentInvoices from './pages/ParentInvoices';
import ParentAttendance from './pages/ParentAttendance';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminManageUsers /></PrivateRoute>} />
      <Route path="/admin/students" element={<PrivateRoute role="admin"><AdminManageStudents /></PrivateRoute>} />
      <Route path="/admin/groups" element={<PrivateRoute role="admin"><AdminManageGroups /></PrivateRoute>} />
      <Route path="/admin/groups/:name" element={<PrivateRoute role="admin"><AdminGroupDetails /></PrivateRoute>} />
      <Route path="/admin/approve-payments" element={<PrivateRoute role="admin"><AdminApprovePayments /></PrivateRoute>} />
      <Route path="/admin/messages" element={<PrivateRoute role="admin"><AdminMessages /></PrivateRoute>} />
      <Route path="/admin/registration-requests" element={<PrivateRoute role="admin"><AdminRegistrationRequests /></PrivateRoute>} />
      <Route path="/admin/finance" element={<PrivateRoute role="admin"><AdminFinance /></PrivateRoute>} />
      <Route path="/admin/reports" element={<PrivateRoute role="admin"><AdminReports /></PrivateRoute>} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
      <Route path="/teacher/attendance" element={<PrivateRoute role="teacher"><TeacherAttendance /></PrivateRoute>} />
      <Route path="/teacher/reports" element={<PrivateRoute role="teacher"><TeacherReports /></PrivateRoute>} />

      {/* Parent Routes */}
      <Route path="/parent" element={<PrivateRoute role="parent"><ParentPortalHome /></PrivateRoute>} />
      <Route path="/parent/invoices" element={<PrivateRoute role="parent"><ParentInvoices /></PrivateRoute>} />
      <Route path="/parent/attendance" element={<PrivateRoute role="parent"><ParentAttendance /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
