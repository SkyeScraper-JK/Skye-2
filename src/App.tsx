import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DeveloperPropertiesPage from './pages/DeveloperPropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AvailabilityGridPage from './pages/AvailabilityGridPage';
import LeadsPage from './pages/LeadsPage';
import BookingsPage from './pages/BookingsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import DeveloperDashboard from './pages/DeveloperDashboard';
import DeveloperProjects from './pages/DeveloperProjects';
import AddProject from './pages/AddProject';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import EditProject from './pages/EditProject';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetails from './pages/AdminUserDetails';
import AdminUserEdit from './pages/AdminUserEdit';
import AdminLogs from './pages/AdminLogs';
import AdminSettings from './pages/AdminSettings';
import AdminProfile from './pages/AdminProfile';
import DeveloperSettings from './pages/DeveloperSettings';
import AdminProjectDetails from './pages/AdminProjectDetails';
import AdminUnitManagement from './pages/AdminUnitManagement';
import AdminProjects from './pages/AdminProjects';
import AdminLeadDetails from './pages/AdminLeadDetails';
import AdminBookingDetails from './pages/AdminBookingDetails';
import AdminAddProject from './pages/AdminAddProject';
import AdminLeads from './pages/AdminLeads';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <Routes>
          {/* Agent Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/developer/:developerId" element={<DeveloperPropertiesPage />} />
          <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />
          <Route path="/property/:propertyId/availability" element={<AvailabilityGridPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Developer Routes */}
          <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
          <Route path="/developer/projects" element={<DeveloperProjects />} />
          <Route path="/developer/projects/new" element={<AddProject />} />
          <Route path="/developer/projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/developer/projects/:projectId/edit" element={<EditProject />} />
          <Route path="/developer/settings" element={<DeveloperSettings />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
          <Route path="/admin/users/:userId/edit" element={<AdminUserEdit />} />
          <Route path="/admin/agents" element={<AdminUsers />} />
          <Route path="/admin/developers" element={<AdminUsers />} />
          <Route path="/admin/buyers" element={<AdminUsers />} />
          <Route path="/admin/projects/:projectId" element={<AdminProjectDetails />} />
          <Route path="/admin/projects/:projectId/units" element={<AdminUnitManagement />} />
          <Route path="/admin/projects/add" element={<AdminAddProject />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/bookings/:bookingId" element={<AdminBookingDetails />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;