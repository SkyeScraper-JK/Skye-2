import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Building, Calendar, CreditCard, User, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockBookings } from '../data/mockData';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminBookingDetails: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const booking = mockBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Booking not found</h2>
          <button 
            onClick={() => navigate('/admin/leads-bookings')}
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
    nextPaymentDate: booking.nextPaymentDate || ''
  });

  const statusOptions = ['Reserved', 'Payment Pending', 'Confirmed', 'Cancelled'];
  const agentOptions = ['Arjun Mehta', 'Sarah Wilson', 'John Smith', 'Priya Patel'];
  const developerOptions = ['Godrej Properties', 'DLF Limited', 'Prestige Group'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving booking changes:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      status: booking.status,
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
      nextPaymentDate: booking.nextPaymentDate || ''
    });
    setIsEditing(false);
  };

  const handleReassign = (type: 'agent' | 'developer', newAssignee: string) => {
    console.log(`Reassigning booking ${bookingId} to ${type}: ${newAssignee}`);
    setShowReassignModal(false);
  };

  const handleStatusUpdate = (newStatus: string, reason: string) => {
    console.log(`Updating booking ${bookingId} status to: ${newStatus}, reason: ${reason}`);
    setShowStatusModal(false);
  };

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

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/admin/leads-bookings')}
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
                    className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Save
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
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
              <div>
                <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-1">
                  {booking.projectName}
                </h2>
                <p className="text-sm text-neutral-500 font-montserrat mb-2">
                  by {booking.developerName}
                </p>
                <div className="text-sm text-neutral-600">
                  <span className="font-montserrat">Booking Date: {booking.bookingDate}</span>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat border ${getStatusColor(booking.status)}`}>
                {booking.status}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Booking Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Unit Details */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Unit Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Unit Number:</span>
              <span className="font-medium text-neutral-800 font-montserrat ml-2">{booking.unitDetails.unitNumber}</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Type:</span>
              <span className="font-medium text-neutral-800 font-montserrat ml-2">{booking.unitDetails.type}</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Tower:</span>
              <span className="font-medium text-neutral-800 font-montserrat ml-2">{booking.unitDetails.tower}</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Floor:</span>
              <span className="font-medium text-neutral-800 font-montserrat ml-2">{booking.unitDetails.floor}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Payment Information</h3>
          
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
                  <p className="text-lg font-bold text-green-600 font-montserrat">{booking.paidAmount}</p>
                )}
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600 font-montserrat">Payment Progress</span>
                <span className="text-sm font-bold text-primary-600 font-montserrat">{booking.paymentProgress}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${booking.paymentProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500 font-montserrat">Pending Amount:</span>
              <span className="font-bold text-red-600 font-montserrat ml-2">{booking.pendingAmount}</span>
            </div>

            {booking.nextPaymentDate && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm text-yellow-700 font-montserrat">Next Payment Due:</span>
                <span className="font-bold text-yellow-800 font-montserrat ml-2">{booking.nextPaymentDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowReassignModal(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-medium font-montserrat hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Reassign Booking
            </button>
            
            <button 
              onClick={() => setShowStatusModal(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-purple-100 text-purple-700 rounded-lg font-medium font-montserrat hover:bg-purple-200 transition-colors"
            >
              <AlertTriangle className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Update Status
            </button>
            
            <button 
              onClick={() => alert('Conflict resolution tools would open here')}
              className="w-full flex items-center justify-center py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium font-montserrat hover:bg-red-200 transition-colors"
            >
              <AlertTriangle className="w-5 h-5 mr-2" strokeWidth={1.5} />
              Resolve Conflict
            </button>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Reassign Booking</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reassign To
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="reassignType" value="agent" className="mr-2" defaultChecked />
                    <span className="font-montserrat">Different Agent</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="reassignType" value="developer" className="mr-2" />
                    <span className="font-montserrat">Different Developer</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Select New Agent
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer">
                  {agentOptions.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reason for Reassignment
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
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
                onClick={() => handleReassign('agent', 'Selected Agent')}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Update Booking Status</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  New Status
                </label>
                <select className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer">
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Reason for Status Change
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                  placeholder="Enter reason for status change..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleStatusUpdate('Selected Status', 'Admin override')}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleBasedLayout>
  );
};

export default AdminBookingDetails;