import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Activity, Lock, Unlock, RotateCcw, Edit, Eye, Calendar } from 'lucide-react';
import AdminBottomNavigation from '../components/AdminBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockAuditLogs } from '../data/mockData';

const AdminLogs: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const actionTypes = ['all', 'suspend', 'reactivate', 'reset', 'edit', 'view'];
  const dateFilters = ['all', 'today', 'week', 'month'];

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
      case 'view':
        return <Eye className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />;
      default:
        return <Activity className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'suspend':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'reactivate':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'reset':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'edit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'view':
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.targetUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.action === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={false}>
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
              <p className="text-sm text-neutral-500 font-montserrat">Audit Logs</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs by user or action"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Actions</option>
              {actionTypes.slice(1).map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredLogs.length} log entr{filteredLogs.length !== 1 ? 'ies' : 'y'} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center mt-1">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getActionColor(log.action)}`}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    </div>
                    <span className="text-xs text-neutral-500 font-montserrat">
                      {log.timestamp}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-neutral-800 font-montserrat mb-1">
                    {log.description}
                  </h4>
                  
                  <div className="space-y-1 text-xs text-neutral-600">
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat">Target User:</span>
                      <span className="font-medium font-montserrat">{log.targetUser}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat">Admin:</span>
                      <span className="font-medium font-montserrat">{log.adminUser}</span>
                    </div>
                    {log.ipAddress && (
                      <div className="flex items-center justify-between">
                        <span className="font-montserrat">IP Address:</span>
                        <span className="font-medium font-montserrat">{log.ipAddress}</span>
                      </div>
                    )}
                  </div>
                  
                  {log.details && (
                    <div className="mt-2 p-2 bg-neutral-50 rounded-lg">
                      <p className="text-xs text-neutral-600 font-montserrat">
                        <span className="font-medium">Details:</span> {log.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No logs found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default AdminLogs;