import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, MapPin, Globe, DollarSign, Users, Shield, Bell, Save, Edit3 } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';

const DeveloperSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: mockDeveloperProfile
  };

  const [settings, setSettings] = useState({
    // Profile Settings
    companyName: mockDeveloperProfile.companyName,
    designation: mockDeveloperProfile.designation,
    region: mockDeveloperProfile.region,
    phone: mockDeveloperProfile.phone,
    email: mockDeveloperProfile.email,
    
    // Regional & Currency Settings
    currency: mockDeveloperProfile.settings.currency,
    language: mockDeveloperProfile.settings.language,
    timezone: 'Asia/Kolkata',
    
    // Team Permissions
    teamMembers: [
      { id: '1', name: 'John Doe', role: 'Project Manager', permissions: ['view_projects', 'edit_projects'] },
      { id: '2', name: 'Jane Smith', role: 'Sales Manager', permissions: ['view_leads', 'manage_bookings'] },
      { id: '3', name: 'Mike Johnson', role: 'Marketing Head', permissions: ['view_analytics', 'manage_content'] }
    ],
    
    // Notification Settings
    emailNotifications: mockDeveloperProfile.settings.notifications,
    smsNotifications: false,
    pushNotifications: true,
    leadNotifications: true,
    bookingNotifications: true,
    paymentNotifications: true
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    // Here you would typically save settings to your backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'regional', label: 'Regional', icon: Globe },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/developer/dashboard')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  PROPERTY AGENT
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Developer Settings</p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-30">
        <div className="overflow-x-auto">
          <div className="flex space-x-0 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium font-montserrat whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Company Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Your Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={settings.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={settings.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regional & Currency Settings */}
        {activeTab === 'regional' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Regional Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Operating Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={settings.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Permissions */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Team Members</h3>
                </div>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium font-montserrat hover:bg-purple-700 transition-colors">
                  <Users className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Add Member
                </button>
              </div>
              
              <div className="space-y-4">
                {settings.teamMembers.map((member) => (
                  <div key={member.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-neutral-800 font-montserrat">{member.name}</h4>
                        <p className="text-sm text-neutral-600 font-montserrat">{member.role}</p>
                      </div>
                      <button className="p-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {member.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium font-montserrat rounded-md">
                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-orange-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Permission Templates</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800 font-montserrat mb-2">Project Manager</h4>
                  <p className="text-sm text-orange-700 font-montserrat">Full project access, unit management, booking oversight</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 font-montserrat mb-2">Sales Manager</h4>
                  <p className="text-sm text-green-700 font-montserrat">Lead management, booking creation, payment tracking</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 font-montserrat mb-2">Marketing Head</h4>
                  <p className="text-sm text-blue-700 font-montserrat">Content management, analytics access, campaign oversight</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                  <Bell className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Notification Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">Email Notifications</span>
                    <p className="text-sm text-neutral-500 font-montserrat">Receive notifications via email</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.emailNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">SMS Notifications</span>
                    <p className="text-sm text-neutral-500 font-montserrat">Receive notifications via SMS</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.smsNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">Push Notifications</span>
                    <p className="text-sm text-neutral-500 font-montserrat">Browser push notifications</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.pushNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Notification Types</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">New Leads</span>
                    <p className="text-sm text-neutral-500 font-montserrat">Get notified when new leads are assigned</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.leadNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, leadNotifications: !prev.leadNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.leadNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">Bookings</span>
                    <p className="text-sm text-neutral-500 font-montserrat">New bookings and booking updates</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.bookingNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, bookingNotifications: !prev.bookingNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.bookingNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-neutral-800 font-montserrat">Payments</span>
                    <p className="text-sm text-neutral-500 font-montserrat">Payment confirmations and reminders</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    settings.paymentNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`} onClick={() => setSettings(prev => ({ ...prev, paymentNotifications: !prev.paymentNotifications }))}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                      settings.paymentNotifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default DeveloperSettings;