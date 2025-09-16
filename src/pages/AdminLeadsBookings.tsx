import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, Calendar, TrendingUp, MoreVertical, Eye, RefreshCw, Edit } from 'lucide-react';
import { mockLeads, mockBookings, mockDevelopers } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminLeadsBookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const leadStatusOptions = ['All', 'Hot', 'Warm', 'Cold'];
  const bookingStatusOptions = ['All', 'Reserved', 'Payment Pending', 'Confirmed'];
  const agentOptions = ['All', 'Arjun Mehta', 'Sarah Wilson', 'John Smith'];

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cold':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Payment Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Reserved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id: string, action: string, type: 'lead' | 'booking') => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        // In a real app, this would navigate to detailed view
        alert(`Viewing ${type} details for ID: ${id}\n\nThis would open a detailed ${type} information page with full history, contact details, and interaction timeline.`);
        break;
      case 'reassign':
        // In a real app, this would open a reassignment modal
        alert(`Reassigning ${type} ID: ${id}\n\nThis would open a modal to:\n• Select new Agent/Developer\n• Add reassignment reason\n• Send notifications to all parties\n• Log the change in audit trail`);
        break;
      case 'update_status':
        // In a real app, this would open a status update modal
        alert(`Updating ${type} status for ID: ${id}\n\nThis would open a modal to:\n• Change status (Hot/Warm/Cold for leads, Reserved/Confirmed/Cancelled for bookings)\n• Add status change reason\n• Set follow-up reminders\n• Notify relevant parties`);
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
              <p className="text-sm text-neutral-500 font-montserrat">Leads & Bookings Oversight</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by name or project`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
                activeTab === 'leads'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Leads ({mockLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
                activeTab === 'bookings'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Bookings ({mockBookings.length})
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {(activeTab === 'leads' ? leadStatusOptions : bookingStatusOptions).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {agentOptions.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="mb-4">
              <span className="text-sm text-neutral-600 font-montserrat">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                      {lead.buyerName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                      <span className="font-montserrat">{lead.phone}</span>
                      <span className="font-montserrat">{lead.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getLeadStatusColor(lead.status)}`}>
                      {lead.status}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === lead.id ? null : lead.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                      </button>
                      
                      {showActionMenu === lead.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                          <button 
                            onClick={() => handleAction(lead.id, 'view', 'lead')}
                            className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                          >
                            <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            View Details
                          </button>
                          <button 
                            onClick={() => handleAction(lead.id, 'reassign', 'lead')}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                          >
                            <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Reassign
                          </button>
                          <button 
                            onClick={() => handleAction(lead.id, 'update_status', 'lead')}
                            className="w-full flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-montserrat"
                          >
                            <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Update Status
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Project:</span>
                    <span className="font-medium text-neutral-800 font-montserrat">{lead.projectName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Developer:</span>
                    <span className="font-medium text-neutral-800 font-montserrat">{lead.developerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Budget:</span>
                    <span className="font-medium text-primary-600 font-montserrat">{lead.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Last Contact:</span>
                    <span className="font-medium text-neutral-800 font-montserrat">{lead.lastInteraction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="mb-4">
              <span className="text-sm text-neutral-600 font-montserrat">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                      {booking.projectName}
                    </h3>
                    <p className="text-sm text-neutral-500 font-montserrat">
                      by {booking.developerName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getBookingStatusColor(booking.status)}`}>
                      {booking.status}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                      </button>
                      
                      {showActionMenu === booking.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                          <button 
                            onClick={() => handleAction(booking.id, 'view', 'booking')}
                            className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                          >
                            <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            View Details
                          </button>
                          <button 
                            onClick={() => handleAction(booking.id, 'reassign', 'booking')}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                          >
                            <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Reassign
                          </button>
                          <button 
                            onClick={() => handleAction(booking.id, 'update_status', 'booking')}
                            className="w-full flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-montserrat"
                          >
                            <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Update Status
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-500 font-montserrat">Unit:</span>
                      <span className="font-medium text-neutral-800 font-montserrat ml-2">
                        {booking.unitDetails.unitNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-montserrat">Type:</span>
                      <span className="font-medium text-neutral-800 font-montserrat ml-2">
                        {booking.unitDetails.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Total Amount:</span>
                    <span className="font-bold text-neutral-800 font-montserrat">{booking.totalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Paid Amount:</span>
                    <span className="font-medium text-green-600 font-montserrat">{booking.paidAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Booking Date:</span>
                    <span className="font-medium text-neutral-800 font-montserrat">{booking.bookingDate}</span>
                  </div>
                </div>

                {/* Payment Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-600 font-montserrat">Payment Progress</span>
                    <span className="text-sm font-bold text-primary-600 font-montserrat">{booking.paymentProgress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${booking.paymentProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {((activeTab === 'leads' && filteredLeads.length === 0) || 
          (activeTab === 'bookings' && filteredBookings.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'leads' ? 
                <Users className="w-8 h-8 text-neutral-400" /> :
                <Calendar className="w-8 h-8 text-neutral-400" />
              }
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default AdminLeadsBookings;