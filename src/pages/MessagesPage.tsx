import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle, Phone, Paperclip, Send, FileText, Image, DollarSign } from 'lucide-react';
import { mockMessages, mockChatMessages } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'Buyer':
        return 'bg-blue-100 text-blue-700';
      case 'Developer':
        return 'bg-green-100 text-green-700';
      case 'Agent':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'floorplan':
        return <Image className="w-4 h-4" strokeWidth={1.5} />;
      case 'quote':
        return <DollarSign className="w-4 h-4" strokeWidth={1.5} />;
      case 'brochure':
        return <FileText className="w-4 h-4" strokeWidth={1.5} />;
      default:
        return <FileText className="w-4 h-4" strokeWidth={1.5} />;
    }
  };

  const filteredMessages = mockMessages.filter(message =>
    message.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      setNewMessage('');
    }
  };

  if (selectedChat) {
    const selectedContact = mockMessages.find(m => m.id === selectedChat);
    
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
                >
                  <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </button>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold font-montserrat text-sm">
                      {selectedContact?.contactName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-800 font-montserrat">
                      {selectedContact?.contactName}
                    </h2>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium font-montserrat ${getContactTypeColor(selectedContact?.contactType || '')}`}>
                      {selectedContact?.contactType}
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <Phone className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
          {mockChatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderName === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.senderName === 'You'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-800 border border-neutral-200'
              }`}>
                {message.type === 'attachment' ? (
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${
                      message.senderName === 'You' ? 'bg-primary-700' : 'bg-neutral-100'
                    }`}>
                      {getAttachmentIcon(message.attachmentType || '')}
                    </div>
                    <div>
                      <p className="font-medium font-montserrat text-sm">{message.message}</p>
                      <p className={`text-xs font-montserrat ${
                        message.senderName === 'You' ? 'text-primary-100' : 'text-neutral-500'
                      }`}>
                        {message.attachmentName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="font-montserrat">{message.message}</p>
                )}
                <p className={`text-xs mt-1 font-montserrat ${
                  message.senderName === 'You' ? 'text-primary-100' : 'text-neutral-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-neutral-100 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Paperclip className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            
            <button 
              onClick={handleSendMessage}
              className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Send className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
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
              <p className="text-sm text-neutral-500 font-montserrat">Messages</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="px-4 py-6 pb-24">
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedChat(message.id)}
              className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold font-montserrat">
                      {message.contactName.charAt(0)}
                    </span>
                  </div>
                  {message.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold font-montserrat rounded-full flex items-center justify-center">
                      {message.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-neutral-800 font-montserrat truncate">
                      {message.contactName}
                    </h3>
                    <span className="text-xs text-neutral-500 font-montserrat">
                      {message.timestamp}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium font-montserrat ${getContactTypeColor(message.contactType)}`}>
                      {message.contactType}
                    </div>
                  </div>
                  
                  <p className={`text-sm font-montserrat truncate ${
                    message.unreadCount > 0 ? 'font-medium text-neutral-800' : 'text-neutral-600'
                  }`}>
                    {message.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No messages found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Your conversations will appear here
            </p>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default MessagesPage;