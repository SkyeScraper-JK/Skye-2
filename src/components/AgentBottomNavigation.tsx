import React from 'react';
import { Home, FileText, Calendar, MessageCircle, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AgentBottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: FileText, label: 'Leads', path: '/leads', active: location.pathname === '/leads' },
    { icon: Calendar, label: 'Bookings', path: '/bookings', active: location.pathname === '/bookings' },
    { icon: MessageCircle, label: 'Messages', path: '/messages', active: location.pathname === '/messages' },
    { icon: User, label: 'Profile', path: '/profile', active: location.pathname === '/profile' },
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

export default AgentBottomNavigation;