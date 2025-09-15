import React from 'react';
import { LayoutDashboard, Building, Users, FileText, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DeveloperBottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/developer/dashboard', active: location.pathname === '/developer/dashboard' },
    { icon: Building, label: 'Projects', path: '/developer/projects', active: location.pathname.startsWith('/developer/projects') },
    { icon: Settings, label: 'Settings', path: '/developer/settings', active: location.pathname.startsWith('/developer/settings') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-primary-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={1.5} />
              <span className="text-xs font-medium font-montserrat">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default DeveloperBottomNavigation;