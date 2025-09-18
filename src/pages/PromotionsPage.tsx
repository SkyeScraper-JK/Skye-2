import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Calendar, Building, Star, Eye, Filter } from 'lucide-react';
import { mockPromotions, mockProperties, mockDevelopers } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  const getPromotions = () => {
    switch (filter) {
      case 'active':
        return mockPromotions.filter(p => p.isActive && new Date(p.validUntil) > new Date());
      case 'expired':
        return mockPromotions.filter(p => !p.isActive || new Date(p.validUntil) <= new Date());
      case 'all':
      default:
        return mockPromotions;
    }
  };

  const filteredPromotions = getPromotions();

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
              <p className="text-sm text-neutral-500 font-montserrat">Promotions & Offers</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {[
              { id: 'active', label: 'Active' },
              { id: 'expired', label: 'Expired' },
              { id: 'all', label: 'All' }
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
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="px-4 py-6 pb-24">
        <div className="mb-4">
          <span className="text-sm text-neutral-600 font-montserrat">
            {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {filteredPromotions.map((promotion) => {
            const property = mockProperties.find(p => p.id === promotion.propertyId);
            const developer = mockDevelopers.find(d => d.id === promotion.developerId);
            const expired = isExpired(promotion.validUntil);
            const daysRemaining = getDaysRemaining(promotion.validUntil);

            return (
              <div 
                key={promotion.id} 
                className={`bg-white rounded-xl shadow-sm border border-neutral-100 p-4 ${
                  expired ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    expired ? 'bg-neutral-100' : 'bg-accent-gold bg-opacity-20'
                  }`}>
                    <Gift className={`w-6 h-6 ${
                      expired ? 'text-neutral-400' : 'text-accent-gold'
                    }`} strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-neutral-800 font-montserrat">
                        {promotion.title}
                      </h3>
                      {!expired && daysRemaining <= 7 && (
                        <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium font-montserrat rounded-full">
                          {daysRemaining} days left
                        </div>
                      )}
                      {expired && (
                        <div className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium font-montserrat rounded-full">
                          Expired
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-neutral-600 font-montserrat mb-3">
                      {promotion.message}
                    </p>
                    
                    {property && (
                      <div className="mb-3">
                        <div className="flex items-center text-sm text-primary-600 mb-1">
                          <Building className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          <span className="font-montserrat">{property.name}</span>
                        </div>
                        <p className="text-xs text-neutral-500 font-montserrat ml-6">
                          {property.location} • by {developer?.name}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-accent-gold bg-opacity-10 rounded-lg p-3 mb-3">
                      <h4 className="font-bold text-neutral-800 font-montserrat mb-1">Offer Details:</h4>
                      <p className="text-sm text-neutral-700 font-montserrat">
                        {promotion.offerDetails}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-neutral-500">
                        <Calendar className="w-3 h-3 mr-1" strokeWidth={1.5} />
                        <span className="font-montserrat">
                          Valid: {new Date(promotion.validFrom).toLocaleDateString()} - {new Date(promotion.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {property && (
                        <button 
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="flex items-center text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
                        >
                          <Eye className="w-4 h-4 mr-1" strokeWidth={1.5} />
                          View Property
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No promotions found</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              {filter === 'active' ? 'No active promotions at the moment' : 
               filter === 'expired' ? 'No expired promotions' : 
               'Promotions will appear here when available'}
            </p>
          </div>
        )}
      </div>

      <AgentBottomNavigation />
    </RoleBasedLayout>
  );
};

export default PromotionsPage;