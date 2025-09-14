import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDevelopers } from '../data/mockData';
import SearchFilters from '../components/SearchFilters';
import DeveloperCard from '../components/DeveloperCard';
import AgentBottomNavigation from '../components/AgentBottomNavigation';
import RoleBasedLayout from '../components/RoleBasedLayout';
import { mockCurrentUser } from '../data/mockData';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDeveloperClick = (developerId: string) => {
    navigate(`/developer/${developerId}`);
  };

  return (
    <RoleBasedLayout user={mockCurrentUser} showRoleSwitcher={true}>
      {/* Hero Section */}
      <div className="bg-white pb-12">
        <div className="pt-16 pb-8 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-extra-wide text-primary-600 font-montserrat mb-4">
            PROPERTY AGENT
            <div className="w-32 h-1 bg-gradient-to-r from-accent-gold to-primary-600 mx-auto mt-3 rounded-full"></div>
          </h1>
          <p className="text-neutral-500 font-montserrat text-lg font-light">
            Discover • Manage • Book Properties in Real-Time
          </p>
        </div>
        
        {/* Search Filters */}
        <SearchFilters />
      </div>

      {/* Developer Results */}
      <div className="px-4 py-8 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-800 font-montserrat mb-2">
            Featured Developers
          </h2>
          <p className="text-neutral-500 font-montserrat text-sm">
            Discover properties from India's leading developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockDevelopers.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              onClick={() => handleDeveloperClick(developer.id)}
            />
          ))}
        </div>
      </div>

    </RoleBasedLayout>
  );
};

export default LandingPage;