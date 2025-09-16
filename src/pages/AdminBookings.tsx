import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, Building, Users, CreditCard, Eye, RotateCcw, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockBookings, mockCurrentUser, mockDeveloperProfile } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [developerFilter, setDeveloperFilter] = useState('All');
  const [showReassignModal, setShowReassignModal] = useState<string | null>(null);
  const [reassignType, setReassignType] = useState<'agent' | 'developer'>('agent');
  const [reassignReason, setReassignReason] = useState('');

  const statusOptions = ['All', 'Reserved', 'Payment Pending', 'Confirmed', 'Cancelled'];
  const agentOptions = ['All', 'Arjun Mehta', 'Sarah Wilson', 'David Kumar', 'Priya Patel'];
  const developerOptions = ['All', 'Godrej Properties', 'DLF Limited', 'Prestige Group'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Payment Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Reserved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1.5} />;
      case 'Payment Pending':
        return <Clock className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />;
      case 'Reserved':
        return <AlertTriangle className="w-4 h-4 text-blue-600" strokeWidth={1.5} />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" strokeWidth={1.5} />;
    }
  };

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.developerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.unitDetails.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    // For demo purposes, we'll use mock agent/developer names
    const matchesAgent = agentFilter === 'All' || true; // Would filter by actual agent
    const matchesDeveloper = developerFilter === 'All' || booking.developerName === developerFilter;
    return matchesSearch && matchesStatus && matchesAgent && matchesDeveloper;
  });

  const handleReassignBooking = (bookingId: string, type: 'agent' | 'developer') => {
    setShowReassignModal(bookingId);
    setReassignType(type);
  };

  const handleConfirmReassign = () => {
    console.log(`Reassigning booking ${showReassignModal} to new ${reassignType}. Reason: ${reassignReason}`);
    setShowReassignModal(null);
    setReassignReason('');
  };

  const handleUpdateStatus = (bookingId: string, newStatus: string) => {
    console.log(`Admin updating booking ${bookingId} status to ${newStatus}`);
  };

  const handleViewDetails = (bookingId: string) => {
    navigate(`/admin/bookings/${bookingId}`);
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
              <p className="text-sm text-neutral-500 font-montserrat">Booking Management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings by project, developer, or unit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {statusOptions.map(status => (
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

            <select
              value={developerFilter}
              onChange={(e) => setDeveloperFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
            >
              {developerOptions.map(developer => (
                <option key={developer} value={developer}>{developer}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neutral-800 font-montserrat">{mockBookings.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 font-montserrat">
              {mockBookings.filter(b => b.status === 'Confirmed').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Confirmed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 font-montserrat">
              {mockBookings.filter(b => b.status === 'Payment Pending').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 font-montserrat">
              {mockBookings.filter(b => b.status === 'Reserved').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Reserved</div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              {/* Booking Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                    <Building className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                      {booking.projectName}
                    </h3>
                    <p className="text-sm text-neutral-500 font-montserrat">
                      by {booking.developerName}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1">{booking.status}</span>
                </div>
              </div>

              {/* Unit Details */}
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
                  <div>
                    <span className="text-neutral-500 font-montserrat">Tower:</span>
                    <span className="font-medium text-neutral-800 font-montserrat ml-2">
                      {booking.unitDetails.tower}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-montserrat">Floor:</span>
                    <span className="font-medium text-neutral-800 font-montserrat ml-2">
                      {booking.unitDetails.floor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700 font-montserrat">Payment Progress</span>
                  <span className="text-sm font-bold text-primary-600 font-montserrat">{booking.paymentProgress}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${booking.paymentProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-neutral-600">
                  <span className="font-montserrat">Paid: {booking.paidAmount}</span>
                  <span className="font-montserrat">Pending: {booking.pendingAmount}</span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Total Amount:</span>
                  <span className="font-bold text-neutral-800 font-montserrat">{booking.totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-montserrat">Booking Date:</span>
                  <span className="font-medium text-neutral-800 font-montserrat">{booking.bookingDate}</span>
                </div>
                {booking.nextPaymentDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Next Payment:</span>
                    <span className="font-medium text-accent-gold font-montserrat">{booking.nextPaymentDate}</span>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                <button 
                  onClick={() => handleViewDetails(booking.id)}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  View Details
                </button>
                <button 
                  onClick={() => handleReassignBooking(booking.id, 'agent')}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat text-sm hover:bg-blue-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Reassign
                </button>
                <button 
                  onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                  className="flex-1 flex items-center justify-center py-2 px-3 bg-red-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-red-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No bookings found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Reassign Booking
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reassign To
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setReassignType('agent')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium font-montserrat text-sm transition-colors ${
                      reassignType === 'agent'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    New Agent
                  </button>
                  <button
                    onClick={() => setReassignType('developer')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium font-montserrat text-sm transition-colors ${
                      reassignType === 'developer'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    New Developer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Select {reassignType === 'agent' ? 'Agent' : 'Developer'}
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer">
                  <option value="">Choose {reassignType}...</option>
                  {reassignType === 'agent' ? 
                    agentOptions.slice(1).map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    )) :
                    developerOptions.slice(1).map(developer => (
                      <option key={developer} value={developer}>{developer}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reason for Reassignment
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Enter reason for reassignment..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReassignModal(null)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
              >
                Confirm Reassign
              </button>
            </div>
          </div>
        </div>
      )}

    </RoleBasedLayout>
  );

  function handleViewDetails(bookingId: string) {
    navigate(`/admin/bookings/${bookingId}`);
  }
};

export default AdminBookings;