import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Building, Calendar, CreditCard, User, Phone, Mail, RotateCcw, AlertTriangle } from 'lucide-react';
import { mockBookings } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminBookingDetails: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignType, setReassignType] = useState<'agent' | 'developer'>('agent');
  const [reassignReason, setReassignReason] = useState('');
  
  const booking = mockBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Booking not found</h2>
          <button 
            onClick={() => navigate('/admin/bookings')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to bookings
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    status: booking.status,
    totalAmount: booking.totalAmount,
    paidAmount: booking.paidAmount,
    pendingAmount: booking.pendingAmount,
    nextPaymentDate: booking.nextPaymentDate || ''
  });

  const statusOptions = ['Reserved', 'Payment Pending', 'Confirmed', 'Cancelled'];
  const agentOptions = ['Arjun Mehta', 'Sarah Wilson', 'David Kumar', 'Priya Patel'];
  const developerOptions = ['Godrej Properties', 'DLF Limited', 'Prestige Group'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Admin updating booking:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      status: booking.status,
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
      pendingAmount: booking.pendingAmount,
      nextPaymentDate: booking.nextPaymentDate || ''
    });
    setIsEditing(false);
  };

  const handleReassign = () => {
    console.log(`Reassigning booking to new ${reassignType}. Reason: ${reassignReason}`);
    setShowReassignModal(false);
    setReassignReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Payment Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Reserved':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
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
                onClick={() => navigate('/admin/bookings')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  ADMIN DASHBOARD
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Booking Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Save
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Edit Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Booking Header */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
                  {booking.projectName}
                </h2>
                <p className="text-sm text-primary-600 font-montserrat mb-2">
                  by {booking.developerName}
                </p>
                <div className="flex items-center text-sm text-neutral-600">
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span className="font-montserrat">Booked on {booking.bookingDate}</span>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="px-3 py-2 bg-neutral-50 border-0 rounded-lg text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            ) : (
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(booking.status)}`}>
                {booking.status}
              </div>
            )}
          </div>

          {/* Unit Details */}
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-neutral-800 font-montserrat mb-3">Unit Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500 font-montserrat">Unit Number:</span>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Total Amount
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <p className="text-lg font-bold text-neutral-800 font-montserrat">{booking.totalAmount}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Payment Progress
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${booking.paymentProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-primary-600 font-montserrat">{booking.paymentProgress}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Paid Amount
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <p className="text-lg font-medium text-green-600 font-montserrat">{booking.paidAmount}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Pending Amount
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pendingAmount"
                    value={formData.pendingAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <p className="text-lg font-medium text-red-600 font-montserrat">{booking.pendingAmount}</p>
                )}
              </div>
            </div>

            {booking.nextPaymentDate && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Next Payment Date
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nextPaymentDate"
                    value={formData.nextPaymentDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                ) : (
                  <p className="text-lg font-medium text-accent-gold font-montserrat">{booking.nextPaymentDate}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowReassignModal(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Reassign Booking
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => console.log('Resolving conflict for booking:', bookingId)}
                className="flex items-center justify-center py-3 px-4 bg-yellow-100 text-yellow-700 rounded-lg font-medium font-montserrat hover:bg-yellow-200 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Resolve Conflict
              </button>
              
              <button 
                onClick={() => console.log('Generating booking report for:', bookingId)}
                className="flex items-center justify-center py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                <CreditCard className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Payment Report
              </button>
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Buyer Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Buyer Name</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">Rajesh Kumar</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Phone</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">+91 98765 43210</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm text-neutral-600 font-montserrat">Email</span>
              </div>
              <span className="font-medium text-neutral-800 font-montserrat">rajesh.kumar@email.com</span>
            </div>
          </div>
        </div>
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
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    New Agent
                  </button>
                  <button
                    onClick={() => setReassignType('developer')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium font-montserrat text-sm transition-colors ${
                      reassignType === 'developer'
                        ? 'bg-red-600 text-white'
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
                    agentOptions.map(agent => (
                      <option key={agent} value={agent}>{agent}</option>
                    )) :
                    developerOptions.map(developer => (
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
                onClick={() => setShowReassignModal(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
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
};

export default AdminBookingDetails;