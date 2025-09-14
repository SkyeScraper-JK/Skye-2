import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Shield, Mail, Calendar, Activity, Settings, Bell, LogOut, User, Lock, Key } from 'lucide-react';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockAdminUser, mockAdminProfile } from '../data/mockData';

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const profile = mockAdminProfile;

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
                <p className="text-sm text-neutral-500 font-montserrat">Admin Profile</p>
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
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-red-600" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl font-bold text-neutral-800 font-montserrat mb-1">
              {profile.name}
            </h2>
            <p className="text-red-600 font-medium font-montserrat mb-1">
              System Administrator
            </p>
            <div className="flex items-center justify-center text-neutral-500 text-sm">
              <Shield className="w-4 h-4 mr-1" strokeWidth={1.5} />
              <span className="font-montserrat">Super Admin Access</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-neutral-600">
              <Mail className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{profile.email}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Calendar className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">Last Login: {profile.lastLogin}</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Activity className="w-5 h-5 mr-3 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">Member since: {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-red-700 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Admin Permissions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Admin Permissions</h3>
          
          <div className="space-y-3">
            {profile.permissions.map((permission, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-neutral-800 font-montserrat">
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-neutral-800 font-montserrat">Manage Users</span>
              </div>
              <div className="text-neutral-400">→</div>
            </button>

            <button 
              onClick={() => navigate('/admin/logs')}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-neutral-800 font-montserrat">View Audit Logs</span>
              </div>
              <div className="text-neutral-400">→</div>
            </button>

            <button 
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-neutral-800 font-montserrat">System Settings</span>
              </div>
              <div className="text-neutral-400">→</div>
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">Security</h3>
          
          <div className="space-y-4">
            {/* Change Password */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                  <Key className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Change Password</span>
                  <p className="text-sm text-neutral-500 font-montserrat">Update your admin password</p>
                </div>
              </div>
              <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                Change
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Two-Factor Authentication</span>
                  <p className="text-sm text-neutral-500 font-montserrat">Enabled</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Session Management */}
            <div className="flex items-center justify-between py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-medium text-neutral-800 font-montserrat">Active Sessions</span>
                  <p className="text-sm text-neutral-500 font-montserrat">1 active session</p>
                </div>
              </div>
              <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                Manage
              </button>
            </div>

            {/* Logout */}
            <div className="flex items-center py-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <LogOut className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              </div>
              <button className="font-medium text-red-600 font-montserrat hover:text-red-700">
                Logout from All Devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminProfile;