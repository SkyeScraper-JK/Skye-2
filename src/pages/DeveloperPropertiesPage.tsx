import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, List, Filter } from 'lucide-react';
import { mockDevelopers, mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const DeveloperPropertiesPage: React.FC = () => {
  const { developerId } = useParams<{ developerId: string }>();
  const navigate = useNavigate();
  
  const developer = mockDevelopers.find(d => d.id === developerId);
  const properties = mockProperties.filter(p => p.developerId === developerId);

  if (!developer) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Developer not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Filter className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <Grid3X3 className="w-5 h-5 text-primary-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <List className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Developer Hero */}
      <div className="bg-white px-4 py-6 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-600 font-bold font-montserrat text-xl">
              {developer.name.charAt(0)}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-800 font-montserrat mb-2">
            {developer.name}
          </h1>
          
          <p className="text-neutral-500 font-montserrat mb-4">
            {properties.length} Properties Available in {developer.location.split(',')[0]}
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
            <div className="text-center">
              <span className="block font-bold text-neutral-800">{developer.projectCount}</span>
              <span className="font-montserrat">Projects</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="text-center">
              <span className="block font-bold text-primary-600">{developer.startingPrice}</span>
              <span className="font-montserrat">Starting Price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Bar */}
      <div className="bg-white border-b border-neutral-100 px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600 font-montserrat">
            Sort by:
          </span>
          <select className="text-sm font-medium text-primary-600 bg-transparent border-0 font-montserrat focus:ring-0 cursor-pointer">
            <option value="price">Price</option>
            <option value="possession">Possession Date</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4 pb-24">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => handlePropertyClick(property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No properties available</h3>
            <p className="text-neutral-400 font-montserrat text-sm">
              Check back later for new listings from {developer.name}
            </p>
          </div>
        )}
      </div>

    </RoleBasedLayout>
  );
};

export default DeveloperPropertiesPage;