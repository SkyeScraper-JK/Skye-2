import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Gift, Calendar, Building, Edit, Trash2, Eye, Users, Bell } from 'lucide-react';
import { mockPromotions, mockProperties, mockAgentPropertyInterest } from '../data/mockData';
import DeveloperBottomNavigation from '../components/DeveloperBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser, mockDeveloperProfile } from '../data/mockData';

const DeveloperPromotions: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    propertyId: '',
    title: '',
    message: '',
    offerDetails: '',
    validFrom: '',
    validUntil: ''
  });
  
  // Create a developer user for the layout
  const developerUser = {
    ...mockCurrentUser,
    role: 'developer' as const,
    profile: mockDeveloperProfile
  };

  // Filter promotions for current developer (mock: show all for demo)
  const developerPromotions = mockPromotions;
  const developerProperties = mockProperties; // In real app, filter by developer

  const handleCreatePromotion = () => {
    if (newPromotion.propertyId && newPromotion.title && newPromotion.message && newPromotion.offerDetails) {
      console.log('Creating promotion:', newPromotion);
      // Here you would typically send to backend
      setNewPromotion({
        propertyId: '',
        title: '',
        message: '',
        offerDetails: '',
        validFrom: '',
        validUntil: ''
      });
      setShowCreateModal(false);
    }
  };

  const handleDeletePromotion = (promotionId: string) => {
    console.log('Deleting promotion:', promotionId);
    // Here you would typically call backend API
  };

  const getInterestedAgentsCount = (propertyId: string) => {
    return mockAgentPropertyInterest.filter(interest => 
      interest.propertyId === propertyId && interest.isInterested
    ).length;
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) <= new Date();
  };

  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const endDate = new Date(validUntil);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <RoleBasedLayout user={developerUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/developer/projects')}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                  PROPERTY AGENT
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
                </h1>
                <p className="text-sm text-neutral-500 font-montserrat">Promotions & Offers</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Create Offer
            </button>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {developerPromotions.length} promotion{developerPromotions.length !== 1 ? 's' : ''} created
          </span>
        </div>

        <div className="space-y-4">
          {developerPromotions.map((promotion) => {
            const property = mockProperties.find(p => p.id === promotion.propertyId);
            const expired = isExpired(promotion.validUntil);
            const daysRemaining = getDaysRemaining(promotion.validUntil);
            const interestedAgents = getInterestedAgentsCount(promotion.propertyId);

            return (
              <div 
                key={promotion.id} 
                className={`bg-white rounded-xl shadow-sm border border-neutral-100 p-4 ${
                  expired ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      expired ? 'bg-neutral-100' : 'bg-accent-gold bg-opacity-20'
                    }`}>
                      <Gift className={`w-6 h-6 ${
                        expired ? 'text-neutral-400' : 'text-accent-gold'
                      }`} strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1">
                        {promotion.title}
                      </h3>
                      {property && (
                        <div className="flex items-center text-sm text-primary-600 mb-2">
                          <Building className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          <span className="font-montserrat">{property.name}</span>
                        </div>
                      )}
                      <p className="text-sm text-neutral-600 font-montserrat">
                        {promotion.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!expired && (
                      <button 
                        onClick={() => navigate(`/developer/promotions/${promotion.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-accent-gold bg-opacity-10 rounded-lg p-3 mb-3">
                  <h4 className="font-bold text-neutral-800 font-montserrat mb-1">Offer Details:</h4>
                  <p className="text-sm text-neutral-700 font-montserrat">
                    {promotion.offerDetails}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-xs text-neutral-500">
                    <Calendar className="w-3 h-3 mr-1" strokeWidth={1.5} />
                    <span className="font-montserrat">
                      {new Date(promotion.validFrom).toLocaleDateString()} - {new Date(promotion.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-neutral-600">
                    <Users className="w-3 h-3 mr-1" strokeWidth={1.5} />
                    <span className="font-montserrat">
                      {interestedAgents} agent{interestedAgents !== 1 ? 's' : ''} interested
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {property && (
                    <button 
                      onClick={() => navigate(`/developer/projects/${property.id}`)}
                      className="flex-1 flex items-center justify-center py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      View Property
                    </button>
                  )}
                  {!expired && (
                    <button 
                      onClick={() => console.log(`Sending notification for promotion ${promotion.id}`)}
                      className="flex-1 flex items-center justify-center py-2 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors"
                    >
                      <Bell className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Notify Agents
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {developerPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No promotions created</h3>
            <p className="text-neutral-400 font-montserrat text-sm mb-4">
              Create promotional offers to attract agents and boost sales
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
            >
              Create Your First Promotion
            </button>
          </div>
        )}
      </div>

      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4">
              Create Promotion
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Select Property *
                </label>
                <select
                  value={newPromotion.propertyId}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, propertyId: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 appearance-none cursor-pointer"
                >
                  <option value="">Choose property...</option>
                  {developerProperties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Promotion Title *
                </label>
                <input
                  type="text"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  placeholder="e.g., Limited Time Offer - 5% Discount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Promotion Message *
                </label>
                <textarea
                  value={newPromotion.message}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                  placeholder="Brief message about the promotion..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                  Offer Details *
                </label>
                <textarea
                  value={newPromotion.offerDetails}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, offerDetails: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600 resize-none"
                  placeholder="Detailed offer terms and conditions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={newPromotion.validFrom}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 font-montserrat mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={newPromotion.validUntil}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border-0 rounded-xl text-neutral-800 font-montserrat focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePromotion}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
              >
                Create Promotion
              </button>
            </div>
          </div>
        </div>
      )}

      <DeveloperBottomNavigation />
    </RoleBasedLayout>
  );
};

export default DeveloperPromotions;