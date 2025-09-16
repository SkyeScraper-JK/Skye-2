import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, Building, Phone, Mail, Calendar, CreditCard, MoreVertical, UserCheck, RefreshCw, Edit } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockLeads, mockBookings, mockDevelopers } from '../data/mockData';

const AdminLeadsBookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const leadStatusOptions = ['all', 'Hot', 'Warm', 'Cold'];
  const bookingStatusOptions = ['all', 'Reserved', 'Payment Pending', 'Confirmed'];

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return 'bg-red-100 text-red-700';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cold':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Payment Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Reserved':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getDeveloperName = (developerId: string) => {
    const developer = mockDevelopers.find(d => d.id === developerId);
    return developer?.name || 'Unknown Developer';
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLeadAction = (leadId: string, action: string) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'reassign':
        alert(`Reassigning lead ${leadId} to a different agent. This would open a reassignment modal in a full implementation.`);
        break;
      case 'update_status':
        alert(`Updating status for lead ${leadId}. This would open a status update modal in a full implementation.`);
        break;
      case 'view':
        alert(`Viewing details for lead ${leadId}. This would navigate to a detailed lead view in a full implementation.`);
        break;
      default:
        break;
    }
  };

  const handleBookingAction = (bookingId: string, action: string) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'reassign':
        alert(`Reassigning booking ${bookingId} to a different agent/developer. This would open a reassignment modal in a full implementation.`);
        break;
      case 'update_status':
        alert(`Updating status for booking ${bookingId}. This would open a status update modal in a full implementation.`);
        break;
      case 'view':
        alert(`Viewing details for booking ${bookingId}. This would navigate to a detailed booking view in a full implementation.`);
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
              placeholder={`Search ${activeTab} by name, project, or developer`}
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

          {/* Filter */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
              >
                {(activeTab === 'leads' ? leadStatusOptions : bookingStatusOptions).map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
            <button className="p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
              <Filter className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {activeTab === 'leads' && (
          <>
            <div className="mb-4">
              <span className="text-sm text-neutral-600 font-montserrat">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                          {lead.buyerName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" strokeWidth={1.5} />
                            <span className="font-montserrat">{lead.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" strokeWidth={1.5} />
                            <span className="font-montserrat">{lead.email}</span>
                          </div>
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getLeadStatusColor(lead.status)}`}>
                          {lead.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === lead.id ? null : lead.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                      </button>
                      
                      {showActionMenu === lead.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                          <button 
                            onClick={() => handleLeadAction(lead.id, 'view')}
                            className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                          >
                            <Users className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            View Details
                          </button>
                          <button 
                            onClick={() => handleLeadAction(lead.id, 'reassign')}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                          >
                            <UserCheck className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Reassign Agent
                          </button>
                          <button 
                            onClick={() => handleLeadAction(lead.id, 'update_status')}
                            className="w-full flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-montserrat"
                          >
                            <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Update Status
                          </button>
                        </div>
                      )}
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

                  <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                    <button 
                      onClick={() => handleLeadAction(lead.id, 'reassign')}
                      className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat text-sm hover:bg-blue-200 transition-colors"
                    >
                      Reassign
                    </button>
                    <button 
                      onClick={() => handleLeadAction(lead.id, 'update_status')}
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            <div className="mb-4">
              <span className="text-sm text-neutral-600 font-montserrat">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                          {booking.projectName}
                        </h3>
                        <p className="text-sm text-neutral-600 font-montserrat mb-2">
                          by {booking.developerName}
                        </p>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getBookingStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                      </button>
                      
                      {showActionMenu === booking.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[160px]">
                          <button 
                            onClick={() => handleBookingAction(booking.id, 'view')}
                            className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                          >
                            <Building className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            View Details
                          </button>
                          <button 
                            onClick={() => handleBookingAction(booking.id, 'reassign')}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                          >
                            <UserCheck className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Reassign Agent
                          </button>
                          <button 
                            onClick={() => handleBookingAction(booking.id, 'update_status')}
                            className="w-full flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-montserrat"
                          >
                            <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                            Update Status
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500 font-montserrat">Unit:</span>
                      <span className="font-medium text-neutral-800 font-montserrat">
                        {booking.unitDetails.tower} - {booking.unitDetails.unitNumber} ({booking.unitDetails.type})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500 font-montserrat">Total Amount:</span>
                      <span className="font-medium text-primary-600 font-montserrat">{booking.totalAmount}</span>
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

                  <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'reassign')}
                      className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat text-sm hover:bg-blue-200 transition-colors"
                    >
                      Reassign
                    </button>
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'update_status')}
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {((activeTab === 'leads' && filteredLeads.length === 0) || 
          (activeTab === 'bookings' && filteredBookings.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'leads' ? 
                <Users className="w-8 h-8 text-neutral-400" /> :
                <Building className="w-8 h-8 text-neutral-400" />
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