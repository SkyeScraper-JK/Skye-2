import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, Building, User, CreditCard, MoreVertical, Eye, RefreshCw, Edit, AlertTriangle } from 'lucide-react';
import { mockBookings, mockDevelopers } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [developerFilter, setDeveloperFilter] = useState('All');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const statusOptions = ['All', 'Reserved', 'Payment Pending', 'Confirmed', 'Cancelled'];
  const agentOptions = ['All', 'Arjun Mehta', 'Sarah Wilson', 'John Smith', 'Priya Patel'];
  const developerOptions = ['All', ...mockDevelopers.map(d => d.name)];

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

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.developerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesDeveloper = developerFilter === 'All' || booking.developerName === developerFilter;
    return matchesSearch && matchesStatus && matchesDeveloper;
  });

  const handleAction = (bookingId: string, action: string) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        navigate(`/admin/bookings/${bookingId}`);
        break;
      case 'reassign':
        navigate(`/admin/bookings/${bookingId}?action=reassign`);
        break;
      case 'update_status':
        navigate(`/admin/bookings/${bookingId}?action=status`);
        break;
      case 'resolve_conflict':
        navigate(`/admin/bookings/${bookingId}?action=conflict`);
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
              <p className="text-sm text-neutral-500 font-montserrat">Booking Oversight</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings by project or developer"
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
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                    {booking.projectName}
                  </h3>
                  <p className="text-sm text-neutral-500 font-montserrat mb-2">
                    by {booking.developerName}
                  </p>
                  <div className="text-sm text-neutral-600">
                    <span className="font-montserrat">Booking Date: {booking.bookingDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(booking.status)}`}>
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
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-10 min-w-[180px]">
                        <button 
                          onClick={() => handleAction(booking.id, 'view')}
                          className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-montserrat"
                        >
                          <Eye className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleAction(booking.id, 'reassign')}
                          className="w-full flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 font-montserrat"
                        >
                          <RefreshCw className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Reassign Booking
                        </button>
                        <button 
                          onClick={() => handleAction(booking.id, 'update_status')}
                          className="w-full flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-montserrat"
                        >
                          <Edit className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Update Status
                        </button>
                        <button 
                          onClick={() => handleAction(booking.id, 'resolve_conflict')}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 font-montserrat"
                        >
                          <AlertTriangle className="w-4 h-4 mr-3" strokeWidth={1.5} />
                          Resolve Conflict
                        </button>
                      </div>
                    )}
                  </div>
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

              {/* Payment Information */}
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
                  <span className="text-neutral-500 font-montserrat">Pending Amount:</span>
                  <span className="font-medium text-red-600 font-montserrat">{booking.pendingAmount}</span>
                </div>
                {booking.nextPaymentDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-montserrat">Next Payment:</span>
                    <span className="font-medium text-accent-gold font-montserrat">{booking.nextPaymentDate}</span>
                  </div>
                )}
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
    </RoleBasedLayout>
  );
};

export default AdminBookings;