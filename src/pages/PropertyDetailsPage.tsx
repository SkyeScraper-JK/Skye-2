import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Heart, MapPin, Calendar, Bed, Bath, Download, Grid3X3, Phone, MessageCircle, Star, Bell, BellOff } from 'lucide-react';
import { getMockPropertyDetails, mockAgentPropertyInterest, mockProjects, mockDevelopers } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';
import { supabase } from '../lib/supabase';

const PropertyDetailsPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInterestedInPromoting, setIsInterestedInPromoting] = useState(
    mockAgentPropertyInterest.some(
      interest => interest.agentId === mockCurrentUser.id && 
                 interest.propertyId === propertyId && 
                 interest.isInterested
    )
  );
  
  // Load project from database or mock data
  React.useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        // First try to load from database
        const { data: dbProject, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error || !dbProject) {
          // Fall back to mock data
          const mockProperty = getMockPropertyDetails(propertyId!);
          if (mockProperty) {
            setProperty(mockProperty);
          }
        } else {
          // Transform database project to property details format
          const developer = mockDevelopers.find(d => d.id === dbProject.developer_id.toString());
          const transformedProperty = {
            id: dbProject.id.toString(),
            name: dbProject.name,
            developerId: dbProject.developer_id.toString(),
            developer: developer?.name || 'Unknown Developer',
            image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            location: dbProject.location,
            startingPrice: '₹1.2 Cr',
            possessionDate: 'Dec 2025',
            propertyType: 'Apartment' as const,
            bedrooms: '2-4 BHK',
            bathrooms: '2-3',
            status: 'Available' as const,
            highlights: ['Premium Location', 'Modern Amenities', 'Ready to Move'],
            description: dbProject.description || 'Experience luxury living at its finest with world-class amenities, modern architecture, and prime location connectivity.',
            amenities: [
              'Swimming Pool',
              'Gym & Fitness Center',
              'Clubhouse',
              'Children\'s Play Area',
              'Landscaped Gardens',
              'Security System',
              '24/7 Power Backup',
              'Parking Space'
            ],
            floorPlans: [
              {
                id: '1',
                type: '2 BHK',
                image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
                size: '1200 sq.ft'
              },
              {
                id: '2',
                type: '3 BHK',
                image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
                size: '1650 sq.ft'
              }
            ],
            brochures: [
              {
                id: '1',
                name: 'Project Brochure',
                url: '#'
              },
              {
                id: '2',
                name: 'Floor Plans',
                url: '#'
              },
              {
                id: '3',
                name: 'Price List',
                url: '#'
              }
            ],
            units: [
              { id: '101', unitNumber: 'A101', floor: 1, type: '2BHK', size: '1200 sq.ft', price: '₹1.2 Cr', status: 'Available' },
              { id: '102', unitNumber: 'A102', floor: 1, type: '2BHK', size: '1200 sq.ft', price: '₹1.2 Cr', status: 'Held' },
              { id: '103', unitNumber: 'A103', floor: 1, type: '3BHK', size: '1650 sq.ft', price: '₹1.8 Cr', status: 'Available' },
              { id: '201', unitNumber: 'A201', floor: 2, type: '2BHK', size: '1200 sq.ft', price: '₹1.25 Cr', status: 'Sold' },
              { id: '202', unitNumber: 'A202', floor: 2, type: '2BHK', size: '1200 sq.ft', price: '₹1.25 Cr', status: 'Available' },
              { id: '203', unitNumber: 'A203', floor: 2, type: '3BHK', size: '1650 sq.ft', price: '₹1.85 Cr', status: 'Available' },
              { id: '301', unitNumber: 'A301', floor: 3, type: '2BHK', size: '1200 sq.ft', price: '₹1.3 Cr', status: 'Available' },
              { id: '302', unitNumber: 'A302', floor: 3, type: '2BHK', size: '1200 sq.ft', price: '₹1.3 Cr', status: 'Held' },
              { id: '303', unitNumber: 'A303', floor: 3, type: '3BHK', size: '1650 sq.ft', price: '₹1.9 Cr', status: 'Available' },
            ],
            paymentPlans: [
              {
                id: '1',
                name: 'Standard Plan',
                downPayment: '20%',
                installments: '70% in 24 months',
                possessionPayment: '10%'
              },
              {
                id: '2',
                name: 'Flexi Plan',
                downPayment: '10%',
                installments: '80% in 36 months',
                possessionPayment: '10%'
              }
            ]
          };
          setProperty(transformedProperty);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        // Fall back to mock data
        const mockProperty = getMockPropertyDetails(propertyId!);
        if (mockProperty) {
          setProperty(mockProperty);
        }
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-montserrat">Loading property...</p>
          </div>
        </div>
      </RoleBasedLayout>
    );
  }

  if (!property) {
    return (
      <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
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
      </RoleBasedLayout>
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

  const handlePromotionToggle = () => {
    setIsInterestedInPromoting(!isInterestedInPromoting);
    // Here you would typically update the backend
    console.log(`Agent ${isInterestedInPromoting ? 'opted out of' : 'opted in for'} promoting property ${propertyId}`);
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

        {/* Agent Promotion Interest Toggle */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                {isInterestedInPromoting ? (
                  <Bell className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                ) : (
                  <BellOff className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-blue-800 font-montserrat">Promote This Property</h4>
                <p className="text-sm text-blue-700 font-montserrat">
                  {isInterestedInPromoting 
                    ? 'You\'ll receive notifications about offers and promotions'
                    : 'Get notified about special offers and promotions'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handlePromotionToggle}
              className={`w-12 h-6 rounded-full transition-colors ${
                isInterestedInPromoting ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                isInterestedInPromoting ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
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
          <button 
            onClick={() => navigate(`/property/${propertyId}/book`)}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors"
          >
            Book Now
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