import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { mockBookings } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'Payment Pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />;
      case 'Reserved':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">My Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neutral-800 font-montserrat">{mockBookings.length}</div>
            <div className="text-xs text-neutral-500 font-montserrat">Total Bookings</div>
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
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-4 py-6 pb-24">
        <div className="space-y-6">
          {mockBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              {/* Project Header */}
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

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3 border-t border-neutral-100">
                <button className="flex-1 flex items-center justify-center py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors">
                  <FileText className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  View Agreement
                </button>
                {booking.status === 'Payment Pending' && (
                  <button className="flex-1 flex items-center justify-center py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors">
                    <CreditCard className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Make Payment
                  </button>
                )}
                {booking.status === 'Reserved' && (
                  <button className="flex-1 flex items-center justify-center py-2 px-4 bg-accent-gold text-white rounded-lg font-medium font-montserrat text-sm hover:bg-accent-gold-light transition-colors">
                    <CreditCard className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Complete Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {mockBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No bookings yet</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Your property bookings will appear here
            </p>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default BookingsPage;