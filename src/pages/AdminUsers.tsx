import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MoreVertical, Lock, Unlock, RotateCcw, Edit, Eye, UserCheck, Building, Users } from 'lucide-react';
import AdminBottomNavigation from '../components/AdminBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockAllUsers } from '../data/mockData';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'All Users', icon: Users },
    { id: 'agents', label: 'Agents', icon: UserCheck },
    { id: 'developers', label: 'Developers', icon: Building },
    { id: 'buyers', label: 'Buyers', icon: Users }
  ];

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

  const filteredUsers = mockAllUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || user.role === activeTab.slice(0, -1);
    return matchesSearch && matchesTab;
  });

  const handleAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`);
    setShowActionMenu(null);
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ADMIN DASHBOARD
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">User Management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" strokeWidth={1.5} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold font-montserrat">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-neutral-600 font-montserrat mb-2">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                  </button>
                  
                  {showActionMenu === user.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                      <button 
                        onClick={() => handleAction(user.id, 'view')}
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                      >
                        <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                        View Details
                      </button>
                      <button 
                        onClick={() => handleAction(user.id, 'edit')}
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                      >
                        <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                        Edit User
                      </button>
                      <button 
                        onClick={() => handleAction(user.id, 'reset')}
                        className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                      >
                        <RotateCcw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                        Reset Password
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleAction(user.id, 'suspend')}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 font-montserrat"
                        >
                          <Lock className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Suspend User
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(user.id, 'reactivate')}
                          className="w-full flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-montserrat"
                        >
                          <Unlock className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Reactivate User
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Last Login:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{user.lastLogin}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Joined:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{user.joinedDate}</span>
                </div>
                {user.region && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Region:</span>
                    <span className="font-medium text-neutral-800 font-montserrat">{user.region}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                <button 
                  onClick={() => handleAction(user.id, 'view')}
                  className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleAction(user.id, 'edit')}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No users found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default AdminUsers;