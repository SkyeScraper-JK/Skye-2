import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Globe, Bell, Shield, Database, Users, Activity, Save } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser } from '../data/mockData';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    siteName: 'Property Agent',
    siteDescription: 'Discover • Manage • Book Properties in Real-Time',
    defaultCurrency: 'INR',
    defaultLanguage: 'English',
    emailNotifications: true,
    smsNotifications: false,
    systemNotifications: true,
    maintenanceMode: false,
    userRegistration: true,
    autoApproveAgents: false,
    autoApproveDevelopers: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requirePasswordChange: false,
    enableAuditLogs: true,
    logRetentionDays: '90',
    backupFrequency: 'daily'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    // Here you would typically save settings to your backend
    console.log('Saving settings:', settings);
    // Show success message or navigate back
  };

  return (
    <RoleBasedLayout user={mockAdminUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
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
                <p className="text-sm text-neutral-500 font-montserrat">System Settings</p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Globe className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Site Description
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Default Currency
                </label>
                <select
                  name="defaultCurrency"
                  value={settings.defaultCurrency}
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
                  Default Language
                </label>
                <select
                  name="defaultLanguage"
                  value={settings.defaultLanguage}
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
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
              <Bell className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Email Notifications</span>
                <p className="text-sm text-neutral-500 font-montserrat">Send notifications via email</p>
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
                <p className="text-sm text-neutral-500 font-montserrat">Send notifications via SMS</p>
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
                <span className="font-medium text-neutral-800 font-montserrat">System Notifications</span>
                <p className="text-sm text-neutral-500 font-montserrat">Show system alerts and updates</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.systemNotifications ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, systemNotifications: !prev.systemNotifications }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.systemNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-green-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">User Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">User Registration</span>
                <p className="text-sm text-neutral-500 font-montserrat">Allow new user registrations</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.userRegistration ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, userRegistration: !prev.userRegistration }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.userRegistration ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Auto-approve Agents</span>
                <p className="text-sm text-neutral-500 font-montserrat">Automatically approve agent registrations</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.autoApproveAgents ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, autoApproveAgents: !prev.autoApproveAgents }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.autoApproveAgents ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Auto-approve Developers</span>
                <p className="text-sm text-neutral-500 font-montserrat">Automatically approve developer registrations</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.autoApproveDevelopers ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, autoApproveDevelopers: !prev.autoApproveDevelopers }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.autoApproveDevelopers ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-red-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                name="passwordMinLength"
                value={settings.passwordMinLength}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Require Password Change</span>
                <p className="text-sm text-neutral-500 font-montserrat">Force users to change password on first login</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.requirePasswordChange ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, requirePasswordChange: !prev.requirePasswordChange }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.requirePasswordChange ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
              <Database className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">System Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Maintenance Mode</span>
                <p className="text-sm text-neutral-500 font-montserrat">Put the system in maintenance mode</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.maintenanceMode ? 'bg-red-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800 font-montserrat">Enable Audit Logs</span>
                <p className="text-sm text-neutral-500 font-montserrat">Track all admin actions</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.enableAuditLogs ? 'bg-primary-600' : 'bg-neutral-300'
              }`} onClick={() => setSettings(prev => ({ ...prev, enableAuditLogs: !prev.enableAuditLogs }))}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                  settings.enableAuditLogs ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Log Retention (days)
                </label>
                <input
                  type="number"
                  name="logRetentionDays"
                  value={settings.logRetentionDays}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Backup Frequency
                </label>
                <select
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminSettings;