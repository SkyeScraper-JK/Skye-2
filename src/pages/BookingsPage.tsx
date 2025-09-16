import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, CreditCard, FileText, AlertCircle, CheckCircle, Clock, User, Edit, Plus } from 'lucide-react';
import { mockBookings } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');

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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Token':
        return 'bg-blue-100 text-blue-700';
      case 'Agreement':
        return 'bg-yellow-100 text-yellow-700';
      case 'Final Closure':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const handleStageUpdate = (bookingId: string, newStage: string) => {
    console.log(`Updating booking ${bookingId} stage to ${newStage}`);
  };

  const handleAddNote = (bookingId: string) => {
    if (newNote.trim()) {
      console.log(`Adding note to booking ${bookingId}: ${newNote}`);
      setNewNote('');
      setShowAddNote(false);
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
              <p className="text-sm text-neutral-500 font-montserrat">Booking Tracker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Pipeline Stats */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-lg font-bold text-blue-600 font-montserrat">
              {mockBookings.filter(b => b.stage === 'Token').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Token Stage</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 font-montserrat">
              {mockBookings.filter(b => b.stage === 'Agreement').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Agreement</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 font-montserrat">
              {mockBookings.filter(b => b.stage === 'Final Closure').length}
            </div>
            <div className="text-xs text-neutral-500 font-montserrat">Final Closure</div>
          </div>
        </div>
        
        <div className="text-center">
          <span className="text-sm text-neutral-600 font-montserrat">
            {mockBookings.length} total booking{mockBookings.length !== 1 ? 's' : ''} • 
            {mockBookings.filter(b => b.status === 'Confirmed').length} confirmed
          </span>
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
                    <div className="flex items-center text-sm text-neutral-600 mt-1">
                      <User className="w-4 h-4 mr-1" strokeWidth={1.5} />
                      <span className="font-montserrat">{booking.buyerName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium font-montserrat ${getStageColor(booking.stage)}`}>
                    {booking.stage}
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

              {/* Booking Progress Milestones */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-700 font-montserrat">Booking Progress</span>
                  <select
                    value={booking.stage}
                    onChange={(e) => handleStageUpdate(booking.id, e.target.value)}
                    className="text-xs px-2 py-1 bg-neutral-50 border-0 rounded-lg text-neutral-700 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                  >
                    <option value="Token">Token</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Final Closure">Final Closure</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  {booking.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-2 bg-neutral-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.isCompleted ? 'bg-green-500' : 'bg-neutral-300'
                      }`}>
                        {milestone.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
                        ) : (
                          <Clock className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-neutral-800 font-montserrat">
                          {milestone.title}
                        </h5>
                        <p className="text-xs text-neutral-600 font-montserrat">
                          {milestone.description}
                        </p>
                        {milestone.completedDate && (
                          <p className="text-xs text-green-600 font-montserrat">
                            Completed: {milestone.completedDate}
                          </p>
                        )}
                      </div>
                      {!milestone.isCompleted && (
                        <button 
                          onClick={() => console.log(`Marking milestone ${milestone.id} as completed`)}
                          className="text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  ))}
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

              {/* Agent Notes */}
              {booking.agentNotes.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-700 font-montserrat mb-2">Latest Note:</h5>
                  <p className="text-sm text-blue-800 font-montserrat">
                    {booking.agentNotes[booking.agentNotes.length - 1]}
                  </p>
                  {booking.agentNotes.length > 1 && (
                    <button className="text-xs text-primary-600 font-montserrat hover:text-primary-700 mt-1">
                      View all {booking.agentNotes.length} notes
                    </button>
                  )}
                </div>
              )}

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
              <div className="flex space-x-2 pt-3 border-t border-neutral-100">
                <button 
                  onClick={() => {
                    setSelectedBooking(booking.id);
                    setShowAddNote(true);
                  }}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                </button>
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

      {/* Add Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Add Booking Note
            </h3>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none mb-4"
              placeholder="Add notes about this booking..."
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddNote(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNote(selectedBooking!)}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

    </RoleBasedLayout>
  );
};

export default BookingsPage;