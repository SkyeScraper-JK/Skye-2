import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, Shield } from 'lucide-react';
import { User } from '../types';
import AgentBottomNavigation from './AgentBottomNavigation';
import DeveloperBottomNavigation from './DeveloperBottomNavigation';
import AdminBottomNavigation from './AdminBottomNavigation';

interface RoleBasedLayoutProps {
  user: User;
  children: React.ReactNode;
  showRoleSwitcher?: boolean;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ user, children, showRoleSwitcher = false }) => {
  const navigate = useNavigate();

  const switchToAgent = () => {
    navigate('/');
  };

  const switchToDeveloper = () => {
    navigate('/developer/dashboard');
  };

  const switchToAdmin = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {showRoleSwitcher && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex space-x-1">
            <button
              onClick={switchToAgent}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors ${
                user.role === 'agent' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Agent
            </button>
            <button
              onClick={switchToDeveloper}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors ${
                user.role === 'developer' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Building className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Developer
            </button>
            <button
              onClick={switchToAdmin}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors ${
                user.role === 'admin' 
                  ? 'bg-red-600 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Admin
            </button>
          </div>
        </div>
      )}
      {children}
      {user.role === 'agent' && <AgentBottomNavigation />}
      {user.role === 'developer' && <DeveloperBottomNavigation />}
      {user.role === 'admin' && <AdminBottomNavigation />}
    </div>
  );
};

export default RoleBasedLayout;