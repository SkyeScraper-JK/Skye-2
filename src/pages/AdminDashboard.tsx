import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, Building, UserCheck, Shield, Activity, Search, MoreVertical, Lock, Unlock, RotateCcw, Edit, Eye } from 'lucide-react';
import AdminBottomNavigation from '../components/AdminBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminProfile, mockAdminUser, mockAdminStats, mockRecentActions } from '../data/mockData';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'suspend':
        return <Lock className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
      case 'reactivate':
        return <Unlock className="w-4 h-4 text-green-600" strokeWidth={1.5} />;
      case 'reset':
        return <RotateCcw className="w-4 h-4 text-blue-600" strokeWidth={1.5} />;
      case 'edit':
        return <Edit className="w-4 h-4 text-purple-600" strokeWidth={1.5} />;
      default:
        return <Activity className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'suspend':
        return 'text-red-600';
      case 'reactivate':
        return 'text-green-600';
      case 'reset':
        return 'text-blue-600';
      case 'edit':
        return 'text-purple-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-black uppercase tracking-extra-wide text-primary-600 font-montserrat">
                ADMIN DASHBOARD
                <div className="w-24 h-1 bg-gradient-to-r from-accent-gold to-primary-600 mx-auto mt-2 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat mt-2">
                Superuser panel to manage application users
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <Bell className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-blue-600 font-montserrat">
                {mockAdminStats.totalUsers}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Total Users</p>
            <p className="text-xs text-neutral-500 font-montserrat">All active users</p>
          </button>

          <button 
            onClick={() => navigate('/admin/agents')}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-green-600 font-montserrat">
                {mockAdminStats.agents}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Agents</p>
            <p className="text-xs text-neutral-500 font-montserrat">{mockAdminStats.activeAgents} active</p>
          </button>

          <button 
            onClick={() => navigate('/admin/developers')}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-purple-600 font-montserrat">
                {mockAdminStats.developers}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Developers</p>
            <p className="text-xs text-neutral-500 font-montserrat">{mockAdminStats.activeDevelopers} active</p>
          </button>

          <button 
            onClick={() => navigate('/admin/buyers')}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-accent-gold bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-gold" strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-accent-gold font-montserrat">
                {mockAdminStats.buyers}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 font-montserrat">Buyers</p>
            <p className="text-xs text-neutral-500 font-montserrat">Registered buyers</p>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-center p-4 bg-primary-600 text-white rounded-xl font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/logs')}
              className="flex items-center justify-center p-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-medium font-montserrat hover:bg-neutral-50 transition-colors"
            >
              <Activity className="w-5 h-5 mr-2" strokeWidth={1.5} />
              View Logs
            </button>
          </div>
        </div>

        {/* Pending Alerts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Pending Alerts</h3>
            <span className="text-xs text-neutral-500 font-montserrat">3 items need attention</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-neutral-100">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mt-1">
                  <Lock className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                    Agent Account Locked
                  </h4>
                  <p className="text-sm text-neutral-600 font-montserrat">
                    John Smith's account has been locked due to multiple failed login attempts
                  </p>
                </div>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium font-montserrat hover:bg-red-200 transition-colors">
                  Unlock
                </button>
              </div>

              <div className="flex items-start space-x-3 pb-4 border-b border-neutral-100">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mt-1">
                  <Activity className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                    Developer Inactive
                  </h4>
                  <p className="text-sm text-neutral-600 font-montserrat">
                    ABC Properties hasn't logged in for 90 days
                  </p>
                </div>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium font-montserrat hover:bg-yellow-200 transition-colors">
                  Review
                </button>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                    Role Change Request
                  </h4>
                  <p className="text-sm text-neutral-600 font-montserrat">
                    Agent Sarah wants to switch to Developer role
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium font-montserrat hover:bg-blue-200 transition-colors">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Admin Actions */}
        <div className="pb-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Recent Actions</h3>
            <button 
              onClick={() => navigate('/admin/logs')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="space-y-4">
              {mockRecentActions.map((action) => (
                <div key={action.id} className="flex items-start space-x-3 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center mt-1">
                    {getActionIcon(action.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                      {action.title}
                    </h4>
                    <p className="text-sm text-neutral-600 font-montserrat">
                      {action.description}
                    </p>
                    <p className={`text-xs font-montserrat mt-1 ${getActionColor(action.type)}`}>
                      {action.targetUser}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 font-montserrat whitespace-nowrap">
                    {action.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default AdminDashboard;