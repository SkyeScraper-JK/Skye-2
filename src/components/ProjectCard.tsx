import React from 'react';
import { MapPin, Calendar, Building, Users, TrendingUp, Edit } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  showActions?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, showActions = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Under Construction':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Planning':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const occupancyPercentage = ((project.soldUnits + project.heldUnits) / project.totalUnits) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img 
          src={project.image} 
          alt={project.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium font-montserrat border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-white text-lg font-bold font-montserrat">{project.startingPrice}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-neutral-800 font-montserrat mb-1 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center text-sm text-neutral-500">
            <MapPin className="w-4 h-4 mr-1" strokeWidth={1.5} />
            <span className="font-montserrat">{project.location}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-neutral-600">
              <Building className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{project.totalUnits} Units</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <Calendar className="w-4 h-4 mr-2 text-neutral-400" strokeWidth={1.5} />
              <span className="font-montserrat">{project.possessionDate}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-green-600">
              <Users className="w-4 h-4 mr-2 text-green-500" strokeWidth={1.5} />
              <span className="font-montserrat">{project.soldUnits} Sold</span>
            </div>
            <div className="flex items-center text-blue-600">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-500" strokeWidth={1.5} />
              <span className="font-montserrat">{project.availableUnits} Available</span>
            </div>
          </div>
        </div>

        {/* Occupancy Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-600 font-montserrat">Occupancy</span>
            <span className="text-xs font-bold text-primary-600 font-montserrat">{occupancyPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>

        {showActions ? (
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit action
              }}
              className="flex-1 flex items-center justify-center py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg font-medium font-montserrat text-sm hover:bg-neutral-200 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Edit
            </button>
            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium font-montserrat text-sm hover:bg-primary-700 transition-colors">
              View Details
            </button>
          </div>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium font-montserrat hover:bg-primary-700 transition-colors duration-200"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;