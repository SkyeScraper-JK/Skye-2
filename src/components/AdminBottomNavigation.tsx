import React from 'react';
import { LayoutDashboard, Users, Activity, Settings, Shield } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminBottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: location.pathname === '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users', active: location.pathname === '/admin/users' },
    { icon: Building, label: 'Projects', path: '/admin/projects', active: location.pathname.startsWith('/admin/projects') },
    { icon: Activity, label: 'Leads', path: '/admin/leads-bookings', active: location.pathname.startsWith('/admin/leads') },
    { icon: Settings, label: 'Settings', path: '/admin/settings', active: location.pathname === '/admin/settings' },
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
                  ? 'text-red-600'
                  : 'text-neutral-500 hover:text-red-600'
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

export default AdminBottomNavigation;