import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMockPropertyDetails } from '../data/mockData';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const AvailabilityGridPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  
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

  // Group units by floor
  const unitsByFloor = property.units.reduce((acc, unit) => {
    if (!acc[unit.floor]) {
      acc[unit.floor] = [];
    }
    acc[unit.floor].push(unit);
    return acc;
  }, {} as Record<number, typeof property.units>);

  const floors = Object.keys(unitsByFloor).map(Number).sort((a, b) => b - a);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500 border-green-600';
      case 'Held':
        return 'bg-yellow-500 border-yellow-600';
      case 'Sold':
        return 'bg-gray-400 border-gray-500';
      default:
        return 'bg-gray-400 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-800';
      case 'Held':
        return 'text-yellow-800';
      case 'Sold':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold uppercase tracking-extra-wide text-primary-600 font-montserrat">
                PROPERTY AGENT
                <div className="w-16 h-0.5 bg-gradient-to-r from-accent-gold to-primary-600 mt-1 rounded-full"></div>
              </h1>
              <p className="text-sm text-neutral-500 font-montserrat">Unit Availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Summary */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-neutral-800 font-montserrat">{property.name}</h2>
            <p className="text-sm text-neutral-500 font-montserrat">{property.location}</p>
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold font-montserrat text-lg">
              {property.name.charAt(0)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-medium text-primary-600 font-montserrat">{property.startingPrice}</span>
            <span className="text-neutral-500 font-montserrat ml-1">Starting Price</span>
          </div>
          <div className="text-right">
            <span className="font-medium text-neutral-800 font-montserrat">{property.possessionDate}</span>
            <span className="text-neutral-500 font-montserrat ml-1">Possession</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Held</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
            <span className="font-montserrat text-neutral-600">Sold</span>
          </div>
        </div>
      </div>

      {/* Availability Grid */}
      <div className="p-4 pb-24">
        <div className="space-y-6">
          {floors.map((floorNumber) => (
            <div key={floorNumber} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4 text-center">
                Floor {floorNumber}
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {unitsByFloor[floorNumber].map((unit) => (
                  <div
                    key={unit.id}
                    className={`relative p-4 border-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${getStatusColor(unit.status)}`}
                  >
                    <div className="text-center">
                      <div className={`text-xs font-bold font-montserrat mb-1 ${getStatusTextColor(unit.status)}`}>
                        {unit.unitNumber}
                      </div>
                      <div className={`text-xs font-montserrat ${getStatusTextColor(unit.status)}`}>
                        {unit.type}
                      </div>
                      <div className={`text-xs font-montserrat ${getStatusTextColor(unit.status)}`}>
                        {unit.size}
                      </div>
                    </div>
                    
                    {unit.status === 'Available' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Floor Summary */}
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span className="font-montserrat">
                    Available: {unitsByFloor[floorNumber].filter(u => u.status === 'Available').length}
                  </span>
                  <span className="font-montserrat">
                    Held: {unitsByFloor[floorNumber].filter(u => u.status === 'Held').length}
                  </span>
                  <span className="font-montserrat">
                    Sold: {unitsByFloor[floorNumber].filter(u => u.status === 'Sold').length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-4 text-center">
            Overall Availability
          </h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 font-montserrat">
                {property.units.filter(u => u.status === 'Available').length}
              </div>
              <div className="text-sm text-green-700 font-montserrat">Available</div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 font-montserrat">
                {property.units.filter(u => u.status === 'Held').length}
              </div>
              <div className="text-sm text-yellow-700 font-montserrat">Held</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 font-montserrat">
                {property.units.filter(u => u.status === 'Sold').length}
              </div>
              <div className="text-sm text-gray-700 font-montserrat">Sold</div>
            </div>
          </div>
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default AvailabilityGridPage;