import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Gift, Building, Check, X, Eye } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_property':
        return <Building className="w-5 h-5 text-blue-600" strokeWidth={1.5} />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-accent-gold" strokeWidth={1.5} />;
      default:
        return <Bell className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_property':
        return 'bg-blue-50';
      case 'promotion':
        return 'bg-yellow-50';
      default:
        return 'bg-neutral-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'promotions') return notification.type === 'promotion';
    if (filter === 'properties') return notification.type === 'new_property';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
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
                <p className="text-sm text-neutral-500 font-montserrat">Notifications</p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
              >
                Mark All Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'promotions', label: 'Promotions' },
              { id: 'properties', label: 'Properties' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium font-montserrat transition-all duration-200 ${
                  filter === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {tab.label}
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-6 pb-24">
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-xl shadow-sm border border-neutral-100 p-4 ${
                !notification.isRead ? 'border-l-4 border-l-primary-600' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-bold font-montserrat ${
                      !notification.isRead ? 'text-neutral-800' : 'text-neutral-600'
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                        >
                          <Check className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm font-montserrat mb-2 ${
                    !notification.isRead ? 'text-neutral-700' : 'text-neutral-500'
                  }`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-montserrat">
                      {notification.createdAt}
                    </span>
                    
                    {notification.propertyId && (
                      <button 
                        onClick={() => navigate(`/property/${notification.propertyId}`)}
                        className="flex items-center text-primary-600 text-xs font-medium font-montserrat hover:text-primary-700"
                      >
                        <Eye className="w-3 h-3 mr-1" strokeWidth={1.5} />
                        View Property
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No notifications</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              {filter === 'unread' ? 'All caught up!' : 'Your notifications will appear here'}
            </p>
          </div>
        )}
      </div>

      <AgentBottomNavigation />
    </RoleBasedLayout>
  );
};

export default NotificationsPage;