import React from 'react';
import { MapPin, Calendar, Building } from 'lucide-react';
import { Developer } from '../types';

interface DeveloperCardProps {
  developer: Developer;
  onClick: () => void;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1 group-hover:text-primary-600 transition-colors">
            {developer.name}
          </h3>
          <p className="text-sm text-neutral-500 font-montserrat">
            {developer.description}
          </p>
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center ml-4">
          <Building className="w-6 h-6 text-primary-600" strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-neutral-600">
          <MapPin className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
          <span className="font-montserrat">{developer.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-600">
            <Building className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{developer.projectCount} Projects</span>
          </div>
          
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
            <span className="font-montserrat">{developer.possessionDate}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500 font-montserrat">Starting from</span>
            <span className="text-lg font-bold text-primary-600 font-montserrat">{developer.startingPrice}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-accent-gold rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
};

export default DeveloperCard;