import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Heart, MapPin, Calendar, Bed, Bath, Download, Grid3X3, Phone, MessageCircle } from 'lucide-react';
import { getMockPropertyDetails } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const PropertyDetailsPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const property = getMockPropertyDetails(propertyId!);

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Property not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700';
      case 'Few Units Left':
        return 'bg-yellow-100 text-yellow-700';
      case 'Sold Out':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'floorplans', label: 'Floor Plans' },
    { id: 'brochures', label: 'Brochures' },
    { id: 'availability', label: 'Availability' },
    { id: 'payment', label: 'Payment' }
  ];

  const handleAvailabilityClick = () => {
    navigate(`/property/${propertyId}/availability`);
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Heart className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Share className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-4 right-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium font-montserrat ${getStatusColor(property.status)}`}>
            {property.status}
          </div>
        </div>
      </div>

      {/* Property Header */}
      <div className="bg-white px-4 py-6 border-b border-neutral-100">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-neutral-800 font-montserrat mb-2">
            {property.name}
          </h1>
          <div className="flex items-center text-neutral-500 mb-2">
            <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
            <span className="font-montserrat text-sm">{property.location}</span>
          </div>
          <button 
            onClick={() => navigate(`/developer/${property.developerId}`)}
            className="text-primary-600 font-montserrat text-sm hover:text-primary-700"
          >
            by {property.developer}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <span className="block text-2xl font-bold text-primary-600 font-montserrat">
              {property.startingPrice}
            </span>
            <span className="text-sm text-neutral-500 font-montserrat">Starting Price</span>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <span className="block text-lg font-bold text-neutral-800 font-montserrat">
              {property.possessionDate}
            </span>
            <span className="text-sm text-neutral-500 font-montserrat">Possession</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{property.propertyType}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-30">
        <div className="overflow-x-auto">
          <div className="flex space-x-0 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium font-montserrat whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 pb-32">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-3">Description</h3>
              <p className="text-neutral-600 font-montserrat leading-relaxed">{property.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-neutral-600">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <span className="font-montserrat">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'floorplans' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Floor Plans</h3>
            <div className="grid grid-cols-1 gap-4">
              {property.floorPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                  <img 
                    src={plan.image} 
                    alt={plan.type}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-800 font-montserrat">{plan.type}</h4>
                      <p className="text-sm text-neutral-500 font-montserrat">{plan.size}</p>
                    </div>
                    <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'brochures' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Documents & Brochures</h3>
            <div className="space-y-3">
              {property.brochures.map((brochure) => (
                <div key={brochure.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-3">
                      <Download className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium font-montserrat text-neutral-800">{brochure.name}</span>
                  </div>
                  <button className="text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Unit Availability</h3>
              <button 
                onClick={handleAvailabilityClick}
                className="flex items-center text-primary-600 text-sm font-medium font-montserrat hover:text-primary-700"
              >
                <Grid3X3 className="w-4 h-4 mr-1" strokeWidth={1.5} />
                View Grid
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="grid grid-cols-3 gap-4 text-sm text-center mb-4">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="font-montserrat">Available</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                  <span className="font-montserrat">Held</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                  <span className="font-montserrat">Sold</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {property.units.slice(0, 6).map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-2 border border-neutral-100 rounded">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded mr-3 ${
                        unit.status === 'Available' ? 'bg-green-500' :
                        unit.status === 'Held' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <span className="font-medium font-montserrat text-sm">{unit.unitNumber}</span>
                        <span className="text-neutral-500 font-montserrat text-xs ml-2">{unit.type}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium font-montserrat text-neutral-700">{unit.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 font-montserrat">Payment Plans</h3>
            <div className="space-y-4">
              {property.paymentPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                  <h4 className="font-bold text-neutral-800 font-montserrat mb-3">{plan.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-montserrat">Down Payment:</span>
                      <span className="font-medium font-montserrat text-neutral-800">{plan.downPayment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-montserrat">Installments:</span>
                      <span className="font-medium font-montserrat text-neutral-800">{plan.installments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-montserrat">On Possession:</span>
                      <span className="font-medium font-montserrat text-neutral-800">{plan.possessionPayment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-neutral-200 p-4">
        <div className="flex space-x-3 max-w-md mx-auto">
          <button className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors">
            Reserve Now
          </button>
          <button className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <Phone className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
          </button>
          <button className="p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
          </button>
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default PropertyDetailsPage;