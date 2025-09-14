import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Phone, Mail, MapPin, Target, TrendingUp, Award, Settings, Globe, Bell, LogOut, User } from 'lucide-react';
import { mockAgentProfile } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const profile = mockAgentProfile;

  const progressPercentage = (profile.stats.targetsAchieved / profile.stats.monthlyTarget) * 100;

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
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
                <p className="text-sm text-neutral-500 font-montserrat">My Profile</p>
              </div>
            </div>
            
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Edit3 className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary-600" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
              {profile.name}
            </h2>
            <p className="text-primary-600 font-medium font-montserrat mb-1">
              {profile.designation}
            </p>
            <div className="flex items-center justify-center text-neutral-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" strokeWidth={1.5} />
              <span className="font-montserrat">{profile.region}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-neutral-600">
              <Phone className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{profile.phone}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Mail className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{profile.email}</span>
            </div>
          </div>

          <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Performance Stats</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 font-montserrat">
                {profile.stats.leadsHandled}
              </div>
              <div className="text-sm text-blue-700 font-montserrat">Leads Handled</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 font-montserrat">
                {profile.stats.bookingsClosed}
              </div>
              <div className="text-sm text-green-700 font-montserrat">Bookings Closed</div>
            </div>
          </div>

          {/* Monthly Target Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700 font-montserrat">Monthly Target</span>
              <span className="text-sm font-bold text-primary-600 font-montserrat">
                {profile.stats.targetsAchieved}/{profile.stats.monthlyTarget}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-600">
              <span className="font-montserrat">Progress: {progressPercentage.toFixed(0)}%</span>
              <span className="font-montserrat">
                {profile.stats.monthlyTarget - profile.stats.targetsAchieved} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Settings</h3>
          
          <div className="space-y-4">
            {/* Currency */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Currency</span>
                  <p className="text-sm text-neutral-500 font-montserrat">{profile.settings.currency}</p>
                </div>
              </div>
              <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                Change
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Language</span>
                  <p className="text-sm text-neutral-500 font-montserrat">{profile.settings.language}</p>
                </div>
              </div>
              <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                Change
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                  <Bell className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Notifications</span>
                  <p className="text-sm text-neutral-500 font-montserrat">
                    {profile.settings.notifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                profile.settings.notifications ? 'bg-primary-600' : 'bg-neutral-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  profile.settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>

            {/* Logout */}
            <div className="flex items-center py-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <LogOut className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              </div>
              <button className="font-medium text-red-600 font-montserrat hover:text-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default ProfilePage;