import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Lock, Unlock, RotateCcw, User, Mail, Phone, MapPin, Calendar, Shield, Activity } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockAllUsers } from '../data/mockData';

const AdminUserDetails: React.FC = () => {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'agent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'developer':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'buyer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        navigate(`/admin/users/${userId}/edit`);
        break;
      case 'suspend':
        console.log(`Suspending user ${userId}`);
        break;
      case 'reactivate':
        console.log(`Reactivating user ${userId}`);
        break;
      case 'reset':
        console.log(`Resetting password for user ${userId}`);
        break;
      default:
        break;
    }
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admin/users')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  ADMIN DASHBOARD
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">User Details</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleAction('edit')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Edit className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary-600" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-800 font-montserrat mb-2">
              {user.name}
            </h2>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat border ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Email</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Joined</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">{user.joinedDate}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Last Login</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">{user.lastLogin}</span>
            </div>
            
            {user.region && (
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                  <span className="text-sm text-neutral-600 font-montserrat">Region</span>
                </div>
                <span className="font-medium text-neutral-800 font-montserrat">{user.region}</span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleAction('edit')}
              className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Edit User Details
            </button>
            
            <button 
              onClick={() => handleAction('reset')}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Reset Password
            </button>
            
            {user.status === 'active' ? (
              <button 
                onClick={() => handleAction('suspend')}
                className="w-full flex items-center justify-center py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium font-montserrat hover:bg-red-200 transition-colors"
              >
                <Lock className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Suspend User
              </button>
            ) : (
              <button 
                onClick={() => handleAction('reactivate')}
                className="w-full flex items-center justify-center py-3 px-4 bg-green-100 text-green-700 rounded-lg font-medium font-montserrat hover:bg-green-200 transition-colors"
              >
                <Unlock className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Reactivate User
              </button>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Account Information</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600 font-montserrat">User ID:</span>
              <span className="font-medium text-neutral-800 font-montserrat font-mono">{user.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600 font-montserrat">Account Type:</span>
              <span className="font-medium text-neutral-800 font-montserrat">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600 font-montserrat">Status:</span>
              <span className="font-medium text-neutral-800 font-montserrat">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminUserDetails;