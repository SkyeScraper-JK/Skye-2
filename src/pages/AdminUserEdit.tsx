import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, MapPin, Shield } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockAllUsers } from '../data/mockData';

const AdminUserEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const user = mockAllUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">User not found</h2>
          <button 
            onClick={() => navigate('/admin/users')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to users
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    region: user.region || ''
  });

  const roles = ['agent', 'developer', 'buyer'];
  const statuses = ['active', 'suspended', 'inactive'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log('Updated user data:', formData);
    navigate(`/admin/users/${userId}`);
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/admin/users/${userId}`)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ADMIN DASHBOARD
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Edit User</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    placeholder="Enter region"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  User Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Account Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/users/${userId}`)}
              className="flex-1 py-3 px-6 bg-neutral-100 text-neutral-700 rounded-xl font-medium font-montserrat hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminUserEdit;