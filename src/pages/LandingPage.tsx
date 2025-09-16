import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { mockDevelopers } from '../data/mockData';
import { mockLeads, mockBookings, mockTodayReminders } from '../data/mockData';
import SearchFilters from '../components/SearchFilters';
import DeveloperCard from '../components/DeveloperCard';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDeveloperClick = (developerId: string) => {
    navigate(`/developer/${developerId}`);
  };

  // Calculate dashboard stats
  const leadsByStage = {
    new: mockLeads.filter(l => l.stage === 'New').length,
    contacted: mockLeads.filter(l => l.stage === 'Contacted').length,
    siteVisit: mockLeads.filter(l => l.stage === 'Site Visit').length,
    negotiation: mockLeads.filter(l => l.stage === 'Negotiation').length,
    closed: mockLeads.filter(l => l.stage === 'Closed').length
  };

  const bookingsByStage = {
    token: mockBookings.filter(b => b.stage === 'Token').length,
    agreement: mockBookings.filter(b => b.stage === 'Agreement').length,
    closure: mockBookings.filter(b => b.stage === 'Final Closure').length
  };

  const todayReminders = mockTodayReminders.filter(r => !r.isCompleted);
  const overdueReminders = mockTodayReminders.filter(r => 
    new Date(r.dueDate + ' ' + r.dueTime) < new Date() && !r.isCompleted
  );

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Hero Section */}
      <div className="bg-white pb-12">
        <div className="pt-16 pb-8 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-extra-wide text-primary-600 font-montserrat mb-4">
            PROPERTY AGENT
            <div className="w-32 h-1 bg-gradient-to-r from-accent-gold to-primary-600 mx-auto mt-3 rounded-full"></div>
          </h1>
          <p className="text-neutral-500 font-montserrat text-lg font-light">
            Discover • Manage • Book Properties in Real-Time
          </p>
        </div>
        
        {/* Search Filters */}
        <SearchFilters />
      </div>

      {/* Enhanced Dashboard Widgets */}
      <div className="px-4 py-6">
        {/* Today's Reminders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Today's Reminders</h3>
            <button 
              onClick={() => navigate('/reminders')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            {todayReminders.length > 0 ? (
              <div className="space-y-3">
                {todayReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      reminder.priority === 'high' ? 'bg-red-100' :
                      reminder.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        reminder.priority === 'high' ? 'text-red-600' :
                        reminder.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-neutral-800 font-montserrat">
                        {reminder.title}
                      </h4>
                      <p className="text-xs text-neutral-600 font-montserrat">
                        {reminder.dueTime} • {reminder.description}
                      </p>
                    </div>
                    <button className="text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700">
                      Mark Done
                    </button>
                  </div>
                ))}
                {overdueReminders.length > 0 && (
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="flex items-center text-red-600 text-sm font-medium font-montserrat">
                      <AlertCircle className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      {overdueReminders.length} overdue reminder{overdueReminders.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-sm text-neutral-600 font-montserrat">No reminders for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Pipeline Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Lead Pipeline</h3>
            <button 
              onClick={() => navigate('/leads')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
            >
              Manage Leads
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600 font-montserrat">{leadsByStage.new}</div>
                <div className="text-xs text-blue-700 font-montserrat">New</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600 font-montserrat">{leadsByStage.contacted}</div>
                <div className="text-xs text-yellow-700 font-montserrat">Contacted</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600 font-montserrat">{leadsByStage.siteVisit}</div>
                <div className="text-xs text-purple-700 font-montserrat">Site Visit</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600 font-montserrat">{leadsByStage.negotiation}</div>
                <div className="text-xs text-orange-700 font-montserrat">Negotiation</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600 font-montserrat">{leadsByStage.closed}</div>
                <div className="text-xs text-green-700 font-montserrat">Closed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Pipeline */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Booking Pipeline</h3>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
            >
              View Bookings
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600 font-montserrat">{bookingsByStage.token}</div>
                <div className="text-sm text-blue-700 font-montserrat">Token Stage</div>
                <div className="text-xs text-neutral-500 font-montserrat mt-1">Initial booking</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600 font-montserrat">{bookingsByStage.agreement}</div>
                <div className="text-sm text-yellow-700 font-montserrat">Agreement</div>
                <div className="text-xs text-neutral-500 font-montserrat mt-1">Documentation</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600 font-montserrat">{bookingsByStage.closure}</div>
                <div className="text-sm text-green-700 font-montserrat">Final Closure</div>
                <div className="text-xs text-neutral-500 font-montserrat mt-1">Registration</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Results */}
      <div className="px-4 py-8 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
            Featured Developers
          </h2>
          <p className="text-neutral-500 font-montserrat text-sm">
            Discover properties from India's leading developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockDevelopers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              onClick={() => handleDeveloperClick(developer.id)}
            />
          ))}
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default LandingPage;